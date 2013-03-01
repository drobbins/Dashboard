function(doc){if(doc.type === 'data_management_form' && !doc.deleted && doc.opername){emit(doc.opername, null);}}
