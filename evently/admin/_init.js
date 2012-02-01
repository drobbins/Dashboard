function(){
    var app = $$(this).app,
        db = app.db,
        ddoc_name = app.ddoc._id.split("/")[1];

    db.view(ddoc_name+"/autofill_clinic", {
        group : true,
        success : function(response){
            var clinics = response.rows.map(function(row){return row.key;});
            app.clinics = clinics;
        }
    });

    $("#sidebar").evently("admin-navigation", $$(this).app);
    $.evently.connect("#sidebar","#main", ["get_user"]);
    $(this).trigger("empty", "");
}