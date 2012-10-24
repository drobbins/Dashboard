function(patient){
    if (patient.externalSystem === "IMCCP") { // this is a lookup based patient.
        var newPatient = {
            ptfstnm : patient.firstname.toProperCase(),
            ptlstnm : patient.lastname.toProperCase(),
            ptaddy : patient.city.toProperCase() + ", " + patient.state,
            medrec : patient.mrn
        };
        patient = newPatient;
    }
    patient.ptname = patient.ptfstnm && patient.ptlstnm ? patient.ptfstnm+" "+patient.ptlstnm : "";
    return patient;
}