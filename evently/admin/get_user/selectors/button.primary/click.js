function(){
	var users_db = $.couch.db("_users"),
		user = $$(this).app.user,
		roles = $("form.roles").serializeArray().map(function(role){return role.value;});
	user.roles = roles;
	users_db.saveDoc(user, {success : function(){alert("User updated");}});
	return false;
}