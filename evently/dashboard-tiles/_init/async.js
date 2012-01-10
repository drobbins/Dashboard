function(callback, e, options){
    var views = $$(this).app.ddoc.views;
    if(views.lib){
        delete views.lib;
        delete views.patient_names;
    }
    callback(views);
}
