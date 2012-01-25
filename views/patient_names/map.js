function(doc){
  if (doc.type==="data_management_form"){
    var value = { name : doc.ptlstnm+", "+doc.ptfstnm, opername : doc.opername};
    emit(doc.ptlstnm, value);
    emit(doc.ptfstnm, value);
  }
}
