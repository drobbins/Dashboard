function(doc){if(doc.type === 'data_management_form' && !doc.deleted && doc.bmtmd){emit(doc.bmtmd, null);}}
