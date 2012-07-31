function(data){
    var data_out = {},
        first_row = data.rows[1],
        labels = [],
        url;

    //Get the proper number of labels
    data_out['key_labels'] = first_row.value.labels.key_labels.slice(0,first_row.key.length);
    data_out['group_levels'] = first_row.value.labels.key_labels.map(function(v,i){
        return {
            "group_level" : i+1,
            "label" : v
        };
    });
    data_out['value_labels'] = first_row.value.labels.value_labels;
    data_out['rows'] = data.rows;
    data_out.rows.forEach(function (row) {
        row.value.values = row.value.values.map(function (value) {
            if (value.toPrecision && !(parseInt(value) === parseFloat(value))) return value.toPrecision(3);
            else return value;
        });
    });
    data_out['view'] = $$(this).app.current_view;
    data_out['url'] = $$(this).app.data_url;
    return data_out;
}
