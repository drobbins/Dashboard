function(keys, values, rereduce){
    var first_value = values[0],
        labels = first_value.labels;
        count = sum(values.map(function(v){return v.values[1];})),
        average_lag = sum(values.map(function(v){return v.values[0] * (v.values[1]/count);})),
        values = [average_lag, count];
    return { "values" : values, "labels" : labels};
}
