function(doc){if(doc.type === 'data_management_form' && !doc.deleted && doc.radonloc){emit(doc.radonloc, null);}}
