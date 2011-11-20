function(keys, values, rereduce){
    var first_value = values[0],
        labels = first_value.labels;
        total = sum(values.map(function(v){return v.values[0];})),
        count = sum(values.map(function(v){return v.values[1];})),
        values = [total, count];
    return { "values" : values, "labels" : labels};
}
