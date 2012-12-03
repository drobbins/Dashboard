function(){
	var navbar = this,
		app = $$(navbar).app;
	$.couch.session({success : function(user){
		var name = user.userCtx.name;
			roles = user.userCtx.roles;
		if(!name){
			return $(navbar).trigger("logged-out");
		}
		else if(roles.indexOf("_admin") !== -1){
			$(navbar).trigger("admin");
		}
		else{
			$(navbar).trigger("user");
		}
		$$(navbar).userCtx = user.userCtx;
	}});
}