function(doc){if(doc.type === 'data_management_form' && !doc.deleted && doc.bmtloc){emit(doc.bmtloc, null);}}
