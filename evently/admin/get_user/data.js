function(user){
	var app = $$(this).app
		clinics = $$(this).app.clinics;
	app.user = user;
	return {user : user, clinics : clinics}
}