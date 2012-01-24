function(head, req){
  var first_row = false,
      has_permission = function(row){
        return true;
      };
  provides('json', function(){
    var row = getRow();
    if(row){
      send('[');
      send(JSON.stringify(row));
      while ( row = getRow()){
        send('\n,');
        send(JSON.stringify(row));
      }
      send(']');
    }
  });
}
