function(){
  var app = $$(this).app;
  if (app.sidebar){
    $("#main").removeClass("span14").addClass("span10");
    app.sidebar.insertAfter("#main");
    delete app.sidebar;
  }
  $("#sidebar").unbind().html("");
  $("#main").unbind().evently($(this).attr('href').slice(1), $$(this).app);
}
