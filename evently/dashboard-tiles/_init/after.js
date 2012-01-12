function(){
  var app = $$(this).app,
      views = app.dashboard.views,
      dates = app.dashboard.dates;

  function date_to_string(date_array){
    return date_array[2]+"-"+date_array[0];
  }

  $("#date-slider").slider({
    range : true,
    min : 0,
    max : dates.length-1,
    values : [0,dates.length-1],
    slide : function(event, ui){
      $("#start-time").text(date_to_string(dates[ui.values[0]]));
      $("#end-time").text(date_to_string(dates[ui.values[1]]));
    }
  });

  views.forEach(function(view){
    var tile = $("<li class='tile-container'>").appendTo(".dashboard");
    tile.evently("dashboard-tile", app);
    tile.trigger("get_data", {"view":view});
  });
}
