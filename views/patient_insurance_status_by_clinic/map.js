function(doc){
    if(doc.type === "data_management_form"){
        var extract_visit_date,
            visit_date,
            key,
            value;
        extract_visit_date = require("views/lib/extract_visit_date").extract_visit_date;
        visit_date = extract_visit_date(doc);
        if(visit_date){
            key = [
                visit_date.year,
                visit_date.quarter,
                visit_date.month
            ];
            value = {
                "values" : [1],
                "labels": {
                    "key_labels" : ["clinic", "insurance status", "year", "quarter", "month"],
                    "value_labels" : ["number of visits"]
                }
            };
            if(!doc.previns && !doc.appins){
                key.unshift("unknown");
            }
            else if(doc.appins && doc.appins === "Yes"){
                key.unshift("applied for insurance");
            }
            else if(doc.previns && doc.previns === "Yes"){
                key.unshift("previously insured");
            }
            else {
                key.unshift("no insurance");
            }
            key.unshift(doc.clinic);
            emit(key, value);
        }
    }
}
