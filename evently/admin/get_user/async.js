function(cb, e, args){
	var users_db = $.couch.db("_users");
	users_db.openDoc(args.user, {
		success : function(resp){ cb(resp);}
	});
}