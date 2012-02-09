function(e, args){
    if (args.view){
        var app = $$(this).app;
        $(this).data('view',args.view);
        $(this).data('url', encodeURI(app.db.uri +
            app.ddoc._id + '/_list/export/' +
            args.view +
            '?group=true' +
            ((args.group_level && ("&group_level="+args.group_level)) || "")));
        var view_obj = {
            view : args.view,
            "group": true
        }
        if (args.group_level){
            view_obj.group_level = args.group_level;
        }else{view_obj.group_level = "1";}
        if(view_obj.view.match(/by_clinic/)){
          view_obj.group_level = parseInt(view_obj.group_level)+1;
        }
        $(this).data('previous_view', view_obj);
        return view_obj;
    }
    return {view : "visits"};
}
