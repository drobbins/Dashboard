function(doc){
    if(doc.type === "data_management_form"){
        var extract_visit_date,
            visit_date,
            key,
            value;
        extract_visit_date = require("views/lib/extract_visit_date").extract_visit_date;
        visit_date = extract_visit_date(doc);
        if(visit_date){
            key = [visit_date.year, visit_date.quarter, visit_date.month, doc.clinic];
            value = {
                "values" : [1],
                "labels": {
                    "key_labels" : ["year", "quarter", "month", "clinic", "insurance status"],
                    "value_labels" : ["number of visits"]
                }
            };
            if(!doc.previns && !doc.appins){
                key.push("unknown");
            }
            else if(doc.appins && doc.appins === "Yes"){
                key.push("applied for insurance");
            }
            else if(doc.previns && doc.previns === "Yes"){
                key.push("previously insured");
            }
            else {
                key.push("no insurance");
            }
            emit(key, value);
        }
    }
}
