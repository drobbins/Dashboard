function(){
	var mrn = $("#patient_name_select").val();
	if (!mrn) {
		$(this).trigger('edit_patient', "");
	}
	else {
		$(this).trigger('edit_patient', { "mrn" : mrn });
	}
}