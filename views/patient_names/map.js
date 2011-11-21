function(doc){
  if (doc.type==="data_management_form"){
    emit(doc.ptlstnm, doc.ptlstnm+", "+doc.ptfstnm);
    emit(doc.ptfstnm, doc.ptlstnm+", "+doc.ptfstnm);
  }
}
