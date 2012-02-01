function(cb, e, args){
	var users_database = $.couch.db("_users");
	users_database.allDocs({success : function(response){cb(response);}});
}