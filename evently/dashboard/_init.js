function(){
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


    $("#sidebar").evently("data-navigation", $$(this).app);
    $.evently.connect("#sidebar","#main", ["get_data"]);
    $(this).trigger("empty", "");
}
