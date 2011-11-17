function(e, args){
    if (args.view){
        $$(this).app.current_view = args.view;
        return {
            view : args.view,
            "group": true,
            "group_level" : 2
        }
    }
    return {view : "visits"};
}
