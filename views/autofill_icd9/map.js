function(doc){if(doc.type === 'data_management_form' && !doc.deleted && doc.icd9){emit(doc.icd9, null);}}
