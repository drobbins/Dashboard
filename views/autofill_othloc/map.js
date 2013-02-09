function(doc){if(doc.type === 'data_management_form' && !doc.deleted && doc.othloc){emit(doc.othloc, null);}}
