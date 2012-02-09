function(data){
    var data_out = {},
        first_row = data.rows[0],
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
    data_out['view'] = $(this).data('view');
    //Make the view name human readable for the title.
    data_out['view_pretty'] = data_out.view.split("_").map(function(s){
      return s.replace(/^./,s.charAt(0).toUpperCase());
    }).join(" ");
    data_out['url'] = $(this).data('url');
    $(this).data('dashboard_data', data_out);
    return data_out;
}
