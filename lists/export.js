function(head, req){
    var view,
        row,
        key_labels,
        value_labels;

    view = req.path[5];

    start({
      "headers" : {
        "Content-type" : "text/plain",
        "Content-Disposition" : "attachment; filename="+view+".xls"
      }
    });

    //Extract labels from the first row
    row = getRow();
    key_labels = row.value.labels.key_labels.slice(0, row.key.length);
    value_labels = row.value.labels.value_labels;

    //Send labels
    key_labels.map(function(label, index){
        send(label+"	");
    });
    value_labels.map(function(label, index){
        if(index !== value_labels.length-1){
            send(label+"	");
        }
        else{
            send(label+"\n");
        }
    });

    do {
        row.key.map(function(k){send(k+"	");});
        row.value.values.map(function(v){send(v+"	");});
        send("\n");
    } while (row = getRow())

}
