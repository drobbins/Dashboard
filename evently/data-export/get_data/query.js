function(e, args){
    if (args.view){
        var app = $$(this).app;
        app.current_view = args.view;
        app.data_url = encodeURI(app.db.uri +
            app.ddoc._id + '/_list/export/' +
            args.view +
            '?group=true' +
            ((args.group_level && ("&group_level="+args.group_level)) || ""));
        var view_obj = {
            view : args.view,
            "group": true
        }
        if (args.group_level){
            view_obj.group_level = args.group_level;
        }
        return view_obj;
    }
    return {view : "visits"};
}
