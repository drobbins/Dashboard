function(doc){if(doc.type === 'data_management_form' && !doc.deleted && doc.surgloc){emit(doc.surgloc, null);}}
