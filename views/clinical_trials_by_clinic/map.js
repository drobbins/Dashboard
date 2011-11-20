function(doc){
    if(doc.type === "data_management_form"){
        var extract_visit_date,
            visit_date,
            key,
            value;
        extract_visit_date = require("views/lib/extract_visit_date").extract_visit_date;
        visit_date = extract_visit_date(doc);
        if(visit_date){
            key = [doc.clinic, visit_date.year, visit_date.quarter, visit_date.month];
            value = {
                "labels" : {
                    "key_labels" : ["clinic", "year", "quarter", "month"],
                    "value_labels" : ["number of enrollments","number of visits"]
                }
            };
            if(doc.cltrial === "Yes"){
                value.values = [1, 1];
            }
            else {
                value.values = [0, 1];
            }
            emit(key, value);
        }
    }
}
