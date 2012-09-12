'use strict';
/*jshint browser:true jquery:true globalstrict:true*/
/*globals $$:false alert:false google:false d3:false*/

var toggleSpinner = function() {
    var spinner = document.getElementById('spinner');
    if (!spinner) {
        spinner = document.createElement('img');
        spinner.setAttribute('src', location.origin + '/_utils/image/spinner.gif');
        spinner.setAttribute('id', 'spinner');
        spinner.setAttribute('style', 'display: show');
        document.body.getElementsByTagName('div')[2].appendChild(spinner);
    } else {
        if (spinner.getAttribute('style').indexOf('none') == -1) {
            spinner.setAttribute('style', 'display: none');
        } else {
            spinner.setAttribute('style', 'display: show');
        }
    }
};

var IMCCP = {};

IMCCP.populateFields = function () {

    //Use Enters as Tabs
    $('input, select, textarea').bind('keydown', function(e) {
        var self, form, focusable, next;

        self = $(this);
        form = self.parents('form:eq(0)');

        if (e.keyCode == 13) {
            focusable = form.find('input,a,select,button,textarea').filter(':visible');
            next = focusable.eq(focusable.index(this)+1);
            if (next.length) {
                next.focus();
            } else {
                form.submit();
            }
            //return false;
        }
    });

    var radios = ["#txsurg", "#txradonc", "#txmedonc", "#cltrial", "#refnav", "#appins", "#previns"],
        i,
        hidden_field,
        selected_clinic,
        $clinic,
        id_of_correct_radio,
        dataDateField, dataDate;

    // Populate Radios
    for (i=0; i<radios.length; i+=1){
        hidden_field = $(radios[i]);
        if (hidden_field.val() === ""){
            hidden_field.val("ni");
        }
        id_of_correct_radio = radios[i]+"-"+hidden_field.val();
        $(id_of_correct_radio).attr("checked","checked");
        hidden_field.remove();
    }

    // Populate Clinic Select Box
    $clinic = $("#clinic");
    selected_clinic = $("#clinic_text").val();
    if(selected_clinic){
        $("[value='"+selected_clinic+"']", $clinic).attr("selected", "selected");
        $("[value='']", $clinic).removeAttr("selected");
        $("#clinic_text").remove();
    }

    // Enter Data Date for new Forms
    dataDateField = $("input[name=datadate]");
    if (!dataDateField.val()) dataDateField.val((new Date()).toISOString());

    // Enable Date Pickers and Format Values
    $(".datepicker").each(function(i){
      var date;
      date = $(this).val().match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}/) ? $.datepicker.parseDate("yy-mm-dd", $(this).val().split("T")[0]) : $(this).val();
      $(this).datepicker({dateFormat:'mm-dd-yy'});
      $(this).datepicker("setDate", date);
    });

    // Enable Autofill Fields
    $(".autofill").autocomplete({
        source : function(request, response){
            var db = $$($("#main")).app.db,
                design_doc_name = $$($("#main")).app.ddoc._id.split("/")[1],
                field_name = $(this.element).attr("name"),
                term = $(this.element).val(),
                nonce = Math.random(),
                that = this;
            $$(that).nonce = nonce;
            db.view(design_doc_name+"/autofill_"+field_name, {
                startkey : term,
                endkey : term+"\u9999", //I don't know why only \u9999 works, not \uFFFF
                limit : 10,
                group : true,
                success : function(results){
                    if($$(that).nonce === nonce){
                        response(results.rows.map(function(row){return row.key;}));
                    }
                }
            });
        }
    });

};

IMCCP.checkField = function (el, event) {
  var $el, $controlGroup, $controls, error;

  $el = $(el);
  $controlGroup = $el.parents(".control-group");
  $controls = $el.parents(".controls");

  error = function (message) {
    $controlGroup.addClass("error");
    $controls.append($("<span>").addClass("help-block").text(message));
  };

  //Clear old errors and help text
  $(".help-block", $controls).remove();
  $controlGroup.removeClass("error");

  // Check for Date Errors
  if ( $el.hasClass("datepicker") && !IMCCP.legalDate($el.val())) {
    error("Please enter valid mm-dd-yyyy date.");
  }

  if ( ($el.attr("name") === "medrec" || $el.attr("name") === "ptfstnm" || $el.attr("name") === "ptlstnm") && $el.val() === "" ) {
    error("This field is required");
  }
};

IMCCP.legalDate = function (dateString) {
  // Ensures dates are legal in the MM-DD-YYYY format
  // Returns false for invalid dates, true otherwise
  var dateTokens, month, day, year;

  if (dateString === "") return true;

  dateTokens = dateString.split("-");
  if (!dateString.match(/^[0-9]{2}-[0-9]{2}-[0-9]{4}$/)) return false;

  month = dateTokens[0];
  if (month > 12 || month < 1) return false;

  day = dateTokens[1];
  if (day > 31 || day < 1) return false;

  return true;
};

IMCCP.lookupPatientByName = function (el) {

  var db, term, nonce, design_doc_name, view;

  db = $$(el).app.db;
  term = $(el).val();
  nonce = Math.random();
  design_doc_name = $$($("#main")).app.ddoc._id.split("/")[1];

  $$(el).nonce = nonce;

  if (term.match(/^[0-9]+$/)) {
    view = "medrecs";
  }
  else {
    view = "patient_names";
  }

  db.list(design_doc_name+"/patient_names", view, {
      startkey : term,
      endkey : term+"\u9999", //I don't know why only \u9999 works, not \uFFFF
      limit : 25
    },
    {
      success : function(names){
        if($$(el).nonce === nonce){
          $("#select_results").html(names.rows.map(function(r){
            var text = r.value.name + " ("+r.value.medrec+")";
            return '<tr><td><a href="#'+r.id+'" class="patient">'+text+'</a></td></tr>';
          }).join(""));
          $("#select_results a").click(function(){$(this).trigger('edit_patient', $(this).attr('href'));});
        }
      }
    }
  );

};

IMCCP.editPatientAsync = function (el, cb, e, patient_id){
  if(patient_id){
    var db = $$(el).app.db;
    db.openDoc(patient_id.slice(1), {success : function(doc){cb(doc);}});
  }
  else{
    cb({});
  }
};

IMCCP.navigationClick = function (el) {
  var app = $$(el).app;
  if (app.sidebar){
    $("#main").removeClass("span12").addClass("span9");
    app.sidebar.insertAfter("#main");
    delete app.sidebar;
  }
  $("#sidebar").unbind().html("");
  $("#main").unbind().evently($(el).attr('href').slice(1), app);
};

IMCCP.submitPatient = function (el) {
  var db = $$(el).app.db;
  $.couch.session({success : function(session){
    var username = session.userCtx.name,
        form, fs, fo, field;

    if(!username){
      alert("Please log in before submitting data");
      return;
    }

    $(".datepicker").each(function(i){
      var value;
      value = $(this).val().match(/^[0-9]{2}-[0-9]{2}-[0-9]{4}/) ? $(this).datepicker('getDate').toISOString() : $(this).val();
      $(this).val(value);
    });

    form = $('form.dmf');
    fs=form.serializeArray();
    fo={};
    for(field in fs){fo[fs[field].name] = fs[field].value;}
    fo.type = 'data_management_form';
    fo.opername = username;
    if (!fo._id){
      delete fo._id;
      delete fo._rev;
    }

    db.saveDoc(fo, {
      success : function (doc) {
        alert("Patient Saved");
        $(el).trigger('edit_patient', "#"+doc.id);
      },
      error : function (code, type, message) {
        var $el, field;
        field = message.split(" ").pop();
        $el = $("input[name='"+field+"']");
        $el.parents(".control-group").addClass("error");
        $el.parents(".controls").append($("<span>").addClass("help-block").text(message));
      }
    });

  }});
};

IMCCP.overviewAsync = function (el, callback, evt, args) {
  var db, ddoc;
  db = $$(el).app.db;
  ddoc = $$($("#main")).app.ddoc._id.split("/")[1];

  db.list(ddoc+"/patient_names", 'datadates', {
    limit : 100,
    include_docs : true,
    descending : true
    },{
    success : function (response) {
      callback(response);
    }
  });

  $$(el).app.sidebar = $("#sidebar").detach();
  $("#main").removeClass("span9").addClass("span12");
};

IMCCP.overviewData = function (el, data) {
  var app = $$(el).app, drawTable;
  $$(el).data = data;
};

IMCCP.overviewAfter = function (el) {
  var data = $$(el).data, drawTable, firstRow, keys;

  data.rows = data.rows.sort(function (a, b) {
    if (a.doc.datadate < b.doc.datadate) return 1;
    if (a.doc.datadate > b.doc.datadate) return -1;
    return 0;
  });

  firstRow = data.rows[0];
  keys = Object.keys(firstRow.doc);

  var headRow = d3.select("table.results thead").append("tr");
  var headers = headRow.selectAll(".tableheader")
      .data(keys)
    .enter().append("th")
      .text(function (d) { return d; })
      .attr("class", "tableheader");

  var body = d3.select("table.results tbody");
  var rows = body.selectAll("tr")
      .data(data.rows)
    .enter().append("tr");

  rows.each( function (d, i) {
    var row = d3.select(this);

    var cells = row.selectAll("td")
      .data(keys)
    .enter().append("td")
      .text(function (k) { return d.doc[k]; });
  });


};
