function(doc){if(doc.type === 'data_management_form' && !doc.deleted && doc.medoncplan){emit(doc.medoncplan, null);}}
