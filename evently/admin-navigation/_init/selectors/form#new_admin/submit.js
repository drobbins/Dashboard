function(){
	var app = $$(this).app,
			db = app.db,
			$form = $(this),
			fdoc = $form.serializeObject();
	db.getDbProperty("_security", {
		success : function(doc){
			if(!(doc.admins.names.indexOf(fdoc.username) >= 0)){
				doc.admins.names.push(fdoc.username);
				db.setDbProperty("_security", doc, {
					success : function(doc){
						alert("Added "+fdoc.username+" as an admin.");
						$form.trigger('_init');
					}
				});
			}
		}
	});
	return false;
}