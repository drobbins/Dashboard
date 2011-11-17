// Extracts the visit date from a Data Managment Form

var make_date_object;

// Load dependencies.
make_date_object = require("views/lib/make_date_object").make_date_object;

exports.extract_visit_date = function extract_visit_date(data_management_form){
    var visit_date = data_management_form.tdysdate ||
        data_management_form.actualdt ||
        data_management_form.offerdt ||
        data_management_form.surgdt ||
        data_management_form.mdoncdt ||
        data_management_form.radondt ||
        data_management_form.plsurdt ||
        data_management_form.bmtdt ||
        data_management_form.dentdt ||
        data_management_form.othdt ||
        data_management_form.datadate;
    return make_date_object(visit_date);
};
