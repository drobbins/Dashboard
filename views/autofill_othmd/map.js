function(doc){if(doc.type === 'data_management_form' && !doc.deleted && doc.othmd){emit(doc.othmd, null);}}
