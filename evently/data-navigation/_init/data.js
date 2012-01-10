function(data){
    var all_views = Object.keys(data).sort(),
        data_views = [];
    all_views.forEach(function(view){
      if(!(view.match(/^autofill/))){
        data_views.push(view);
      }
    });
    return { "views":data_views};
}
