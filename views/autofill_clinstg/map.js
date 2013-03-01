function(doc){if(doc.type === 'data_management_form' && !doc.deleted && doc.clinstg){emit(doc.clinstg, null);}}
