function(callback, e, options){
    var app = $$(this).app,
        db = app.db,
        ddoc = app.ddoc,
        ddoc_name = ddoc._id.split("/")[1],
        all_views = Object.keys(ddoc.views).sort(),
        views = [];

    //Remove non-dashboard views
    all_views.forEach(function(view){
      if(!(view.match(/^autofill/)) &&
         !(view.match(/icd9/)) &&
         !(view.match(/lib/)) &&
         !(view.match(/patient_names/))){
        views.push(view);
      }
    });
    app.dashboard || (app.dashboard = {});
    app.dashboard.views = views;

    db.view(ddoc_name+"/autofill_clinic", {
      group: true,
      success: function(clinic_response){
        var clinics = clinic_response.rows.map(function(row){return row.key;});
        db.view(ddoc_name+"/autofill_dates", {
          group: true,
          success: function(date_response){
            var dates = date_response.rows.map(function(row){return row.key;});
            app.dashboard.dates = dates;
            callback({
              "views": views,
              "clinics": clinics,
              "dates": dates
            });
          }
        });
      }
    });
}
