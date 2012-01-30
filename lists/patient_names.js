function(head, req){
  var rows = [],
      row,
      user = req.userCtx,
      has_permission = function(row){
        rows.push(JSON.stringify(user));
        if((user.roles.indexOf("_admin") >= 0) || row.value.opername === user.name){
          return true;
        }
        return false;
      };

  provides('json', function(){
    var response = {};
    while(row = getRow()){
      if(has_permission(row)){
        rows.push(row);
      }
    }
    response.total_rows = rows.length;
    response.rows = rows;
    send(JSON.stringify(response));
  });
}
