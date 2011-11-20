exports.sum = function sum(keys, values, rereduce){
    var first_value = values[0],
        labels = first_value.labels;
        count = sum(values.map(function(v){return v.values[0];})),
        value = [count];
    return { "values" : [count], "labels" : labels};
};

