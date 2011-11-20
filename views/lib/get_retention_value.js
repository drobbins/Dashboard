exports.get_treatments = function get_treatments(doc){
    var treatments = [];
    if(doc.txmedonc){
        if(doc.txmedonc === "UAB"){
            treatments.push({
                "type" : "medonc",
                "value" : [1,0]
            });
        }
        else if(doc.txmedonc === "Elsewhere"){
            treatments.push({
                "type" : "medonc",
                "value" : [0,1]
            });
        }
    }
    if(doc.txradonc){
        if(doc.txradonc === "UAB"){
            treatments.push({
                "type" : "radonc",
                "value" : [1,0]
            });
        }
        else if(doc.txradonc === "Elsewhere"){
            treatments.push({
                "type" : "radonc",
                "value" : [0,1]
            });
        }
    }
    if(doc.txsurg){
        if(doc.txsurg === "UAB"){
            treatments.push({
                "type" : "surg",
                "value" : [0,1]
            });
        }
        else if(doc.txsurg === "Elsewhere"){
            treatments.push({
                "type" : "surg",
                "value" : [0,1]
            });
        }
    }
    return treatments;
}
