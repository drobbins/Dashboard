function(){
  $("#sidebar").unbind().html("");
  $("#main").unbind().evently($(this).attr('href').slice(1), $$(this).app);
}
