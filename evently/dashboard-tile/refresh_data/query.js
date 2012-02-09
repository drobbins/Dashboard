function(e, args){
  var app = $$(this).app;
  var view_obj = $(this).data('previous_view');
  for (key in args){
    view_obj[key] = args[key];
  }
  if(view_obj.view.match(/by_clinic/)){
    if(args.group_level){
      view_obj.group_level = parseInt(view_obj.group_level)+1;
    }
    if (view_obj.startkey){
      $(this).data('startkey', view_obj.startkey);
      delete view_obj.startkey;
    }
    if (view_obj.endkey){
      $(this).data('endkey', view_obj.endkey);
      delete view_obj.endkey;
    }
  }
  $(this).data('previous_view', view_obj);
  return view_obj;
}
