function (doc) {
  /*jshint couch:true*/
  "use strict";
  if (doc.type === "data_management_form" && doc.deleted) {
    emit(doc.deleted, null);
  }
}