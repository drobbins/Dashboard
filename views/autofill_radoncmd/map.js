function(doc){if(doc.type === 'data_management_form' && !doc.deleted && doc.radoncmd){emit(doc.radoncmd, null);}}
