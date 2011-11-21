function(){
  form = $('form.dmf');
  fs=form.serializeArray();
  fo={};
  for(field in fs){fo[fs[field].name] = fs[field].value};
  fo['type'] = 'data_management_form';
  if (!fo._id){
    delete fo._id;
    delete fo._rev;
  }

  $$(this).app.db.saveDoc(fo, {success : function(doc){ alert("Patient Submitted");}});
}
