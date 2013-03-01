function (doc, req) {
  /*jshint couch:true*/
  var user = req.userCtx;
  if ((user.roles.indexOf("_admin") >= 0 || user.roles.indexOf("dashboard") >= 0) || (user.roles.indexOf(doc.clinic) >= 0)){
    return {
      "json" : doc
    };//doc;
  }
  return {
    "json" : {
      "error" : "unauthorized",
      "reason" : "You are not authorized to view that document.",
      "userCtx" : req.userCtx
    },
    "code" : 401
  };
}