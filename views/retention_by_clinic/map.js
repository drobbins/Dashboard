function(doc){
    if(doc.type === "data_management_form"){
        var extract_visit_date,
            get_treatments,
            visit_date,
            treatments,
            key, value;
        extract_visit_date = require("views/lib/extract_visit_date").extract_visit_date;
        get_treatments = require("views/lib/get_retention_value").get_treatments;
        visit_date = extract_visit_date(doc);
        if(visit_date){
            key = [doc.clinic, null, visit_date.year, visit_date.quarter, visit_date.month];
            value = {
                "labels" : {
                    "key_labels" : ["clinic", "treatment type", "year", "quarter", "month"],
                    "value_labels" : ["treatments at uab","treatments elsewhere"]
                }
            };
            treatments = get_treatments(doc);
            treatments.map(function(treatment){
                key[1] = treatment.type;
                value.values = treatment.value;
                emit(key, value);
            });
        }
    }
}

