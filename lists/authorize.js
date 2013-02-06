function(head, req){
  var rows = [],
      row,
      user = req.userCtx,
      has_permission = function(row){
        if((user.roles.indexOf("_admin") >= 0 || user.roles.indexOf("dashboard") >= 0) || (user.roles.indexOf(row.value.clinic) >= 0)){
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