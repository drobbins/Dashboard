function(doc){if(doc.type === 'data_management_form' && !doc.deleted && doc.medoncmd){emit(doc.medoncmd, null);}}
