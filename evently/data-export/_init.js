function(){
    $("#sidebar").evently("data-navigation", $$(this).app);
    $.evently.connect("#sidebar","#main", ["get_data"]);
    $(this).trigger("empty", "");
}
