function(doc){if(doc.type === 'data_management_form' && !doc.deleted && doc.typeins){emit(doc.typeins, null);}}
