function(e, args){
  $(".tile-container").filter(function(){
    return $(".tile",this).first().attr("id").match(/by_clinic/);
  }).trigger('refresh_data', {"startkey":[$(this).val()], "endkey":[$(this).val()+"\u9999"]});
}
