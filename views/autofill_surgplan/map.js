function(doc){if(doc.type === 'data_management_form' && !doc.deleted && doc.surgplan){emit(doc.surgplan, null);}}
