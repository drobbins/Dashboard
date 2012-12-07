function (doc) {
  /*jshint couch:true*/
  "use strict";
  if (doc.type === "data_management_form"){
    var lib, visitDate, value;
    lib = {
      extractVisitDate : function (dataManagementForm) {
        var visitDate = dataManagementForm.tdysdate ||
          dataManagementForm.accptdt ||
          dataManagementForm.offerdt ||
          dataManagementForm.surgdt ||
          dataManagementForm.mdoncdt ||
          dataManagementForm.radondt ||
          dataManagementForm.plsurdt ||
          dataManagementForm.bmtdt ||
          dataManagementForm.dentdt ||
          dataManagementForm.othdt ||
          dataManagementForm.actualdt ||
          dataManagementForm.datadate;
        return new Date(visitDate);
      },
      daysBetweenDates : function (date1, date2){
        var msInDay = 86400000;
        return parseInt(Math.abs(date1-date2)/msInDay, 10);
      },
      treatments : function (doc){
        var treatments = {};
        if(doc.txmedonc === "UAB"){
          treatments.medonc = 1;
        }
        else if(doc.txmedonc === "Elsewhere"){
          treatments.medonc = -1;
        }
        else treatments.medonc = 0;
        if(doc.txradonc === "UAB"){
          treatments.radonc = 1;
        }
        else if(doc.txradonc === "Elsewhere"){
          treatments.radonc = -1;
        }
        else treatments.radonc = 0;
        if(doc.txsurg === "UAB"){
          treatments.surg = 1;
        }
        else if(doc.txsurg === "Elsewhere"){
          treatments.surg = -1;
        }
        else treatments.surg = 0;
        return treatments;
      }
    };
    visitDate = lib.extractVisitDate(doc);
    if (visitDate){
      value = {};

      //Number of visits
      value.visits = 1;

      //Enrollment in clinical trials
      if (doc.cltrial === "Yes" || doc.cltrial === "yes") {
        value.clinical_trial_enrollments = 1;
      } else{
        value.clinical_trial_enrollments = 0;
      }

      //Lag between contact and appointment dates
      var contactDate = new Date(doc.actualdt),
          lag = lib.daysBetweenDates(contactDate,visitDate);
      lag = lag > 0 ? lag : 0;
      value.lag = lag;

      //Patient Insurance Status
      if(!doc.previns && !doc.appins){
        value.insurance_status = "unknown";
      }
      else if(doc.appins && doc.appins === "Yes"){
        value.insurance_status = "applied for insurance";
      }
      else if(doc.previns && doc.previns === "Yes"){
        value.insurance_status = "previously insured";
      }
      else {
        value.insurance_status = "no insurance";
      }

      //Retention
      value.treatments = {
        txsurg : doc.txsurg,
        txradonc : doc.txradonc,
        txmedonc : doc.txmedonc
      };

      //Clinic
      value.clinic = doc.clinic;

      emit(visitDate.toISOString().slice(0,10), value);
    }
  }
}
