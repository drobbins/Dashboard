function(e, args){
	var dates = $$(this).app.dashboard.dates,
		startkey = dates[args.values[0]],
		endkey = dates[args.values[1]];
	$(".tile-container").trigger('refresh_data', {"startkey":startkey, "endkey":endkey});
}