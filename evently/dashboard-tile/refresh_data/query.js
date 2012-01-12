function(e, args){
  var app = $$(this).app;
  var view_obj = $(this).data('previous_view');
  for (key in args){
    view_obj[key] = args[key];
  }
  if(view_obj.view.match(/by_clinic/)){
    view_obj.group_level = parseInt(view_obj.group_level)+1;
  }
  $(this).data('previous_view', view_obj);
  return view_obj;
}
