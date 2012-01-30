function(){
  var db = $$(this).app.db;
  $.couch.session({success : function(session){
    var username = session.userCtx.name,
        form,
        fs,
        fo;
    if(!username){
      alert("Please log in before submitting data");
      return;
    }
    form = $('form.dmf');
    fs=form.serializeArray();
    fo={};
    for(field in fs){fo[fs[field].name] = fs[field].value};
    fo['type'] = 'data_management_form';
    fo['opername'] = username;
    if (!fo._id){
      delete fo._id;
      delete fo._rev;
    }

    db.saveDoc(fo, {success : function(doc){
      alert("Patient Submitted");
    }});
  }});
}
