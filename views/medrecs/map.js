function(doc){
  if (doc.type==="data_management_form" && !doc.deleted){
    var mrn;
    if (typeof doc.medrec === 'number') mrn = String(doc.medrec);
    else mrn = doc.medrec;
    var value = { name : doc.ptlstnm+", "+doc.ptfstnm, medrec: mrn, clinic : doc.clinic};
    emit(mrn, value);
  }
}
