function(e, args){
  $(".tile-container").trigger('refresh_data', {"group_level":$(this).val()});
}