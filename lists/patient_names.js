function (head, req){
  var rows = [],
      row,
      user = req.userCtx,
      has_permission = function(row){
        if((user.roles.indexOf("_admin") >= 0) || (user.roles.indexOf(row.value.clinic) >= 0)){
          return true;
        }
        return false;
      };

  provides('json', function(){
    if (!req.userCtx.name) {
      start({
        "code" : 401
      });
      send(JSON.stringify({
          "error" : "unauthorized",
          "reason" : "You are not authorized to perform that action."
      }));
    } else {
    var response = {};
      while((row = getRow()) !== null){
        if(has_permission(row)){
          rows.push(row);
        }
      }
      response.total_rows = rows.length;
      response.rows = rows;
      send(JSON.stringify(response));
    }
  });
}
