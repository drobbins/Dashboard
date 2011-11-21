function(){
	var app = $$(this).app,
			db = app.db,
			$form = $(this),
			fdoc = $form.serializeObject();
	db.getDbProperty("_security", {
		success : function(doc){
			debugger;
			if(!(doc.readers.names.indexOf(fdoc.username) >= 0)){
			doc.readers.names.push(fdoc.username);
				db.setDbProperty("_security", doc, {
					success : function(doc){
						alert("Added "+fdoc.username+" as a reader.");
						$form.trigger('_init');
					}
				});
			}
		}
	});
	return false;
}