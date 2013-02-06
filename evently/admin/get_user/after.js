function(){
  var app = $$(this).app,
    roles = app.user.roles;
  roles.forEach(function(role){
    $("option[value='"+role+"']").attr("selected", true);
  });
  if (roles.indexOf("dashboard") !== -1) {
    $("input[name='dashboard']").attr("checked", true);
  }
}
