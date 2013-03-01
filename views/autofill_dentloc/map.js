function(doc){if(doc.type === 'data_management_form' && !doc.deleted && doc.dentloc){emit(doc.dentloc, null);}}
