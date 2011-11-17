function(){
    $(this).trigger("get_data", {"view":$(this).attr('href').slice(1)});
}
