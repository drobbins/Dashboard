function(){
  var db = $$(this).app.db,
      term = $(this).val(),
      nonce = Math.random()
      design_doc_name = $$($("#main")).app.ddoc._id.split("/")[1],
  $$($(this)).nonce = nonce;
  db.view(design_doc_name+"/patient_names", {
    startkey : term,
    endkey : term+"\u9999", //I don't know why only \u9999 works, not \uFFFF
    limit : 25,
    success : function(names){
      if($$($(this)).nonce = nonce){
      $("#select_results").html(names.rows.map(function(r){
        //debugger;
        return '<tr><td><a href="#'+r.id+'" class="patient">'+r.value+'</a></td></tr>';
      }).join(""));
      $("#select_results a").click(function(){$(this).trigger('edit_patient', $(this).attr('href'));});
    }}});
}
