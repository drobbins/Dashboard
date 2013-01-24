'use strict';
/*jshint browser:true jquery:true globalstrict:true*/
/*globals $$:false alert:false google:false d3:false angular:false crossfilter:false dc:false*/

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

var toType = function(obj) {
        return ({}).toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
};

var IMCCP = {};

IMCCP.populateFields = function populateFields () {
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

  var radios = ["#txsurg", "#txradonc", "#txmedonc", "#cltrial", "#refnav", "#appins", "#previns", "#selfrfer"],
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

IMCCP.checkField = function checkField (el, event) {
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

IMCCP.legalDate = function legalDate (dateString) {
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

IMCCP.lookupPatientByName = function lookupPatientByName (el) {

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

IMCCP.editPatientAsync = function editPatientAsync (el, cb, e, patient_id){
  if (patient_id.mrn) {
    IMCCP.emmiPatientLookup(patient_id.mrn, cb);
  }
  else if(patient_id) {
    var db = $$(el).app.db;
    db.openDoc(patient_id.slice(1), {success : function(doc){cb(doc);}});
  }
  else {
    cb({});
  }
};

IMCCP.emmiPatientLookup = function emmiPatientLookup (mrn, cb) {
  $.getJSON("../../../patientLookup?mrn=" + encodeURIComponent(mrn), function (data) {
    cb(data);
  });
};

IMCCP.navigationClick = function navigationClick (el) {
  var app = $$(el).app;
  if (app.sidebar){
    $("#main").removeClass("span12").addClass("span9");
    app.sidebar.insertAfter("#main");
    delete app.sidebar;
  }
  $("#sidebar").unbind().html("");
  $("#main").unbind().evently($(el).attr('href').slice(1), app);
};

IMCCP.submitPatient = function submitPatient (el) {
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

IMCCP.overviewAsync = function overviewAsync (el, callback, evt, args) {
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

IMCCP.overviewData = function overviewData (el, data) {
  var app = $$(el).app, drawTable;
  $$(el).data = data;
};

IMCCP.overviewAfter = function overviewAfter (el) {
  var data = $$(el).data, drawTable, firstRow, keys;

  var hiddenFields = {"_id":true, "_rev":true, "clinic_text":true};

  data.rows = data.rows.sort(function (a, b) {
    if (a.doc.datadate < b.doc.datadate) return 1;
    if (a.doc.datadate > b.doc.datadate) return -1;
    return 0;
  });

  firstRow = data.rows[0];
  keys = Object.keys(firstRow.doc).filter(function (key) {
    return !hiddenFields[key];
  });

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

IMCCP.dataOverview = (function () {

  var overview = angular.module('overview', ['ngResource']);

  overview.factory("Records", function ($resource) {
    return $resource("_list/authorize/stats", {"include_docs" : true}, {
      getAll : {
        method : "GET",
        params : {
          //"limit" : 500,
          "descending" : true
        },
        isArray : true
      }
    });
  });

  overview.controller("OverviewControl", function ($scope, Records) {
    // Remove sidebar
    $$("#navigation").app.sidebar = $("#sidebar").detach();
    $("#main").removeClass("span9").addClass("span12");
    $scope.template = "templates/overview.html";

    // Get Records
    $scope.records = Records.getAll( function () {
      var dateFormat = d3.time.format("%m/%d/%Y");
      var paddedExtent = function paddedExtent(array, accessor, padding) {
        var extent = d3.extent(array, accessor);
        extent[0] -= padding;
        extent[1] += padding;
        return extent;
      };
      $scope.records.forEach(function (r) { r.date = new Date(r.key); });
      $scope.dmf = crossfilter($scope.records);
      $scope.all = $scope.dmf.groupAll();
      $scope.byClinic = $scope.dmf.dimension(function (d) {return d.value.clinic;});
      $scope.visitsByClinic = $scope.byClinic.group().reduceCount();
      $scope.byLag = $scope.dmf.dimension(function (d) {
        return d.value.lag < 60 ? d.value.lag : 60;
      });
      $scope.visitsByLag = $scope.byLag.group().reduceCount();
      $scope.byDate = $scope.dmf.dimension(function (d) { return d3.time.month(d.date); });
      $scope.visitsByDate = $scope.byDate.group().reduceCount();
      $scope.byInsurance = $scope.dmf.dimension(function (d) { return d.value.insurance_status; });
      $scope.visitsByInsurance = $scope.byInsurance.group().reduceCount();

      // Data Table View
      $scope.dataTable = dc.dataTable("#overview-data-table", "overviewCharts")
        .dimension($scope.byClinic)
        .group(function (d) {return d.value.clinic;})
        .size(100)
        .columns([
          function (d) {return d.doc.opername;},
          function (d) {return d.value.clinic;},
          function (d) {return dateFormat(d.date);},
          function (d) {return d.value.lag;}
        ]);

      // Data Count View
      $scope.dataCount = dc.dataCount("#overview-data-count", "overviewCharts")
        .dimension($scope.dmf)
        .group($scope.all);

      // Clinic Counts View
      $scope.clinicChart = dc.pieChart("#overview-clinic-chart", "overviewCharts")
        .width(220).height(220)
        .colors(d3.scale.category10().range())
        .radius(100)
        .innerRadius(30)
        .minAngleForLabel(0.25)
        .dimension($scope.byClinic)
        .group($scope.visitsByClinic)
        .turnOnControls().filterAll();

      // Insurance Counts View
      $scope.clinicChart = dc.pieChart("#overview-insurance-chart", "overviewCharts")
        .width(220).height(220)
        .colors(d3.scale.category10().range())
        .radius(100)
        .innerRadius(30)
        .minAngleForLabel(0.25)
        .dimension($scope.byInsurance)
        .group($scope.visitsByInsurance)
        .turnOnControls().filterAll();

      // Lag Bar Chart
      var lagx = d3.scale.linear().domain(d3.extent($scope.visitsByLag.all(), function (d) { return d.key; }));
      $scope.lagChart = dc.barChart("#overview-lag-chart", "overviewCharts")
        .width(440).height(220)
        .dimension($scope.byLag)
        .group($scope.visitsByLag)
        .x(lagx)
        .elasticX(true)
        .xAxisPadding(5)
        .elasticY(true)
        .filterAll()
        .renderlet( function (chart) {
          var g = chart.g();
          g.attr("transform", "translate(10)");
        });
      $scope.lagChartReset = function lagChartReset () {
        $scope.lagChart.filterAll();
        $scope.redraw();
      };

      // Visits by Date
      var datex = d3.time.scale().domain(d3.extent($scope.visitsByDate.all(), function (d) { return d.key; }));
      $scope.dateChart = dc.barChart("#overview-date-chart", "overviewCharts")
        .width(920).height(220)
        .dimension($scope.byDate)
        .group($scope.visitsByDate)
        .centerBar(true)
        .x(datex)
        .elasticX(true)
        .xAxisPadding(35)
        .xUnits(d3.time.months)
        .elasticY(true)
        .filterAll();
      $scope.dateChartReset = function dateChartReset () {
        $scope.dateChart.filterAll();
        $scope.redraw();
      };

      $scope.redraw = function redraw () {
        dc.redrawAll("overviewCharts");
      };

      dc.renderlet( function () {
        d3.selectAll(".dc-table-row").on("click", function (d) {
          $scope.$broadcast("UpdateModalRecord", d.doc);
          $("#recordModal").modal('show');
        });
      });
      
      dc.renderAll("overviewCharts");

    });
  });

  overview.controller("recordModal", function ($scope) {
    $scope.$on("UpdateModalRecord", function (event, record) {
      $scope.$apply(function () {$scope.record = record;});
    });
  });

  overview.filter("clinicFilter", function () {
    return function (data, clinicName) {
      if (data && clinicName) {
        var regex;
        if (toType(clinicName) === "array") clinicName = clinicName.join("|");
        regex = new RegExp("^"+clinicName, "i");
        return data.filter(function (row) {
          return row.doc.clinic.match(regex);
        });
      }
      else return data;
    };
  });

  return overview;
})();

IMCCP.updateUserRoles = function updateUserRoles (el) {
  var users_db = $.couch.db("_users"),
    user = $$(el).app.user,
    roles = $("form.roles").serializeArray().map(function(role){return role.value;});
  user.roles = roles;
  users_db.saveDoc(user, {success : function(){alert("User updated");}});
  return false;
};

IMCCP.usersClinic = function usersClinic (roles) {
  var i, clinics = [
    "Breast",
    "Gi",
    "Gyn Onc",
    "Head And Neck",
    "Lymp And Leuk",
    "Neuro Onc",
    "Thoracic",
    "Urology"
  ];
  for (i=0; i < roles.length; i++) {
    if (clinics.indexOf(roles[i]) !== -1) return roles[i];
  }
  return false;
};

IMCCP.editPatientData = function editPatientData (patient) {
  var user = $$("#navigation").userCtx;
  if (patient.externalSystem === "IMCCP") { // this is a lookup based patient.
      var newPatient = {
          ptfstnm : patient.firstname.toProperCase(),
          ptlstnm : patient.lastname.toProperCase(),
          ptaddy : patient.city.toProperCase() + ", " + patient.state,
          medrec : patient.mrn
      };
      patient = newPatient;
  }
  if (user.roles.indexOf("_admin") !== -1) {
    patient._admin = true;
    patient.ok = true;
  } else if (user && user.roles) {
    patient._clinic = IMCCP.usersClinic(user.roles);
    patient.clinic = patient.clinic || patient._clinic;
    if (patient._clinic) {
      patient.ok = true;
    }
  }
  patient.ptname = patient.ptfstnm && patient.ptlstnm ? patient.ptfstnm+" "+patient.ptlstnm : "";
  return patient;
};

String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};
