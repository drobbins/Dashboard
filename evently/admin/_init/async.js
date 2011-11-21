function(cb, e, args){
	var db = $$(this).app.db;
	db.getDbProperty("_security", {success: function(doc){cb(doc);}});
}