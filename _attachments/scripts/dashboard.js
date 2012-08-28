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
