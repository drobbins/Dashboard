function(){
    var app = $$(this).app,
        db = app.db,
        ddoc_name = app.ddoc._id.split("/")[1];

    app.clinics = IMCCP.data.clinics;

    $("#sidebar").evently("admin-navigation", $$(this).app);
    $.evently.connect("#sidebar","#main", ["get_user"]);
    $(this).trigger("empty", "");
}
