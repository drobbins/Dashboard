function(){
  var app = $$(this).app,
      data_views = app.dashboard.data_views;

  data_views.forEach(function(view){
    var tile = $("<div class='tile'>").appendTo("#main");
    tile.evently("dashboard-tile", app);
    tile.trigger("get_data", {"view":view});
  });
}
