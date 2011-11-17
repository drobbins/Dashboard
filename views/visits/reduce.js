function(keys, values, rereduce){
    var first_value = values[0],
        labels = first_value.labels;
    if (rereduce){
        var count = sum(values.map(function(v){return v.count;}));
        return {
            "count": count,
            "labels": labels
        };
    }
    else{
        return {
            "count": values.length,
            "labels": labels
        };
    }
}
