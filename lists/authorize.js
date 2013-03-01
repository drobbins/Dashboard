function(head, req){
  var rows = [],
      row,
      user = req.userCtx,
      has_permission = function(row){
        var clinic = row.value && row.value.clinic;
        if (user.roles.indexOf("_admin") >= 0 || user.roles.indexOf("dashboard") >= 0) {
          return true;
        }
        if (clinic && (user.roles.indexOf(clinic) >= 0)){
          return true;
        }
        return false;
      };

  provides('json', function(){
    while(row = getRow()){
      if(has_permission(row)){
        rows.push(row);
      }
    }
    send(JSON.stringify(rows));
  });
}