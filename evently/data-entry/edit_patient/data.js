function(patient){
    patient.ptname = patient.ptfstnm && patient.ptlstnm ? patient.ptfstnm+" "+patient.ptlstnm : "";
    return patient;
}
