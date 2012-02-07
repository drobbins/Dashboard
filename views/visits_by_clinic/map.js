function(doc){
    if(doc.type === "data_management_form"){
        var extract_visit_date,
            visit_date;
        extract_visit_date = require("views/lib/extract_visit_date").extract_visit_date;
        visit_date = extract_visit_date(doc);
        key = [
            visit_date.year,
            visit_date.quarter,
            visit_date.month,
            doc.clinic,
        ];
        value = {
            "values" : [1],
            "labels" : {
                "key_labels" : ["year", "quarter", "month", "clinic"],
                "value_labels" : ["number of visits"]
            }
        };
        emit(key, value);
    }
}


