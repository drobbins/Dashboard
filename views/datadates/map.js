function (doc) {
  if (doc.type === "data_management_form" && doc.datadate) emit(doc.datadate, null);
}
