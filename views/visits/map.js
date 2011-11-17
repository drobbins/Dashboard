function(doc){
    if(doc.type === "data_management_form"){
        var extract_visit_date,
            make_date_object,
            visit_date;
        extract_visit_date = require("views/lib/extract_visit_date").extract_visit_date;
        visit_date = extract_visit_date(doc);
        emit(
            [
                visit_date.year,
                visit_date.quarter,
                visit_date.month
            ],
            {
                "count": 1,
                "labels": {
                    "key_labels" : ["year", "quarter", "month"],
                    "value_labels" : ["number of visits"]
                }
            }
        );
    }
}
