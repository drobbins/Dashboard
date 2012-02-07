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
            key = [visit_date.year, visit_date.quarter, visit_date.month, doc.clinic];
            value = {
                "labels" : {
                    "key_labels" : ["year", "quarter", "month", "clinic", "treatment type"],
                    "value_labels" : ["treatments at uab","treatments elsewhere"]
                }
            };
            treatments = get_treatments(doc);
            treatments.map(function(treatment){
                key.push(treatment.type);
                value.values = treatment.value;
                emit(key, value);
            });
        }
    }
}

