function(data){
    debugger;
    var data_out = {},
        first_row = data.rows[1];

    //Get the proper number of labels
    data_out['key_labels'] = first_row.value.labels.key_labels.slice(0,first_row.key.length);
    data_out['value_labels'] = first_row.value.labels.value_labels;
    data_out['rows'] = data.rows;
    data_out['view'] = $$(this).app.current_view;
    return data_out;
}
