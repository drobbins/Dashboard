function(){
  $("#sidebar").evently("patient-list", $$(this).app);
  $.evently.connect("#sidebar", "#main", ["edit_patient"]);
  $(this).trigger("edit_patient", "");
}
