function(e){
    $(this).trigger("get_data",
        {
            "view":$$(this).app.current_view,
            "group_level": $(this).val().slice(1)
        }
    );
}
