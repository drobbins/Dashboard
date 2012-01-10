function(data){
    var app = $$(this).app;

    app.dashboard = {};
    app.dashboard.config = {};

    app.dashboard.config.colors = {
        "clinics" : {
            "Breast" : "088C98",
            "Gi" : "075F8E",
            "Gyn Onc" : "008168",
            "Head And Neck" : "089853",
            "Lymp And Leuk" : "078E27",
            "Neuro Onc" : "09A500",
            "Thoracic" : "3F9A00",
            "Urology" : "89B109"
        }
    };

    var all_views = Object.keys(data).sort(),
        data_views = [];
    all_views.forEach(function(view){
      if(!(view.match(/^autofill/)) && !(view.match(/icd9/))){
        data_views.push(view);
      }
    });
    app.dashboard.data_views = data_views;
    return { "views":data_views};
}
