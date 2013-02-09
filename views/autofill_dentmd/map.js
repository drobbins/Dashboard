function(doc){if(doc.type === 'data_management_form' && !doc.deleted && doc.dentmd){emit(doc.dentmd, null);}}
