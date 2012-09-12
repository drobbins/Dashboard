function(){
    $(".active", $(this).parents("ul.nav-list")).removeClass("active");
    $(this).parent().addClass("active");
    $(this).trigger("get_data", {"view":$(this).attr('href').slice(1)});
}
