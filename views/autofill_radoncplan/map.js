function(doc){if(doc.type === 'data_management_form' && !doc.deleted && doc.radoncplan){emit(doc.radoncplan, null);}}
