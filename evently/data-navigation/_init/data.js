function(data){
    var all_views = Object.keys(data).sort(),
        data_views = [];
    all_views.forEach(function(view){
      if(!(view.match(/^autofill/)) && !(view.match(/^medrecs$/))){
        data_views.push({ view: view, name : view.split("_").join(" ")});
      }
    });
    return { "views":data_views};
}
