function(doc){if(doc.type === 'data_management_form' && !doc.deleted && doc.surgmd){emit(doc.surgmd, null);}}
