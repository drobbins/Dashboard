function(doc){if(doc.type === 'data_management_form' && !doc.deleted && doc.txplan){emit(doc.txplan, null);}}
