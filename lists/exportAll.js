function (head, req) {
    /*jshint couch:true*/
    var labels, now, row, sendWithTab;

    now = (new Date()).toLocaleFormat("%m-%d-%Y");

    sendWithTab = function (value) {
        send(value + "\t");
    };

    sendRow = function (labels, row) {
        labels.forEach(function (label) {
            sendWithTab(row.doc[label]);
        });
        send("\n");
    };

    // Send headers to ensure the file is opened in Excel.
    start({
      "headers" : {
        "Content-type" : "text/plain",
        "Content-Disposition" : "attachment; filename=DataManagementForms_"+now+".xls"
      }
    });

    // Ensure the docs are included.
    row = getRow();
    if (!row.doc) {
        return send("Please use the option ?include_docs=true with this list.");
    }

    // Extract and send labels
    labels = Object.keys(row.doc);
    labels.forEach( function (label, index) {
        if (index === labels.length-1) return send(label+"\n");
        sendWithTab(label);
    });

    do {
        sendRow(labels, row);
        row = getRow();
    } while (row);
}