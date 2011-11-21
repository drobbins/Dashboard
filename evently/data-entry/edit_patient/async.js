function(cb, e, patient_id){
  if(patient_id){
    var db = $$(this).app.db;
    db.openDoc(patient_id.slice(1), {success : function(doc){cb(doc);}});
  }
  else{
    cb({});
  }
}
