function(doc){
    if(doc.type === "data_management_form" && doc.actualdt){
        var extract_visit_date,
            make_date_object,
            get_days_between_dates,
            visit_date,
            contact_date,
            lag;
        extract_visit_date = require("views/lib/extract_visit_date").extract_visit_date;
        make_date_object = require("views/lib/make_date_object").make_date_object;
        get_days_between_dates = require("views/lib/get_days_between_dates").get_days_between_dates;
        visit_date = extract_visit_date(doc);
        contact_date = make_date_object(doc.actualdt);
        lag = get_days_between_dates(contact_date, visit_date);
        lag = lag > 0 ? lag : 0;
        key = [
            visit_date.year,
            visit_date.quarter,
            visit_date.month
        ];
        value = {
            "values" : [lag, 1],
            "labels": {
                "key_labels" : ["year", "quarter", "month"],
                "value_labels" : ["average lag", "number of visits"]
            }
        };
        emit(key, value);
    }
}

