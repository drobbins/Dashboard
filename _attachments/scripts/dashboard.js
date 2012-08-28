'use strict';
/*jshint browser:true jquery:true globalstrict:true*/
/*globals $$:false */

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
        var self = $(this)
          , form = self.parents('form:eq(0)')
          , focusable
          , next
          ;
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

    // Enter Data Date for new Forms
    dataDateField = $("input[name=datadate]");
    if (!dataDateField.val()) dataDateField.val((new Date()).toISOString());

    // Enable Date Pickers and Format Values
    $(".datepicker").each(function(i){
      var date;
      date = $(this).val().match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}/) ? $.datepicker.parseDate("yy-mm-dd", $(this).val()) : $(this).val();
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
