function(keys, values, rereduce){
    var first_value = values[0],
        labels = first_value.labels;
        treatments_at_uab = sum(values.map(function(v){return v.values[0];})),
        treatments_elsewhere = sum(values.map(function(v){return v.values[1];})),
        value = [treatments_at_uab, treatments_elsewhere];
    return { "values" : value, "labels" : labels};
}
