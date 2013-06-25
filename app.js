var requirejs=require('requirejs');
requirejs.config({nodeRequire: require});

requirejs(['couchapp', 'path', 'fs'], function(couchapp, path, fs){

  var ignore, loadFileOptions, validateDocUpdate, loadAllAttachments;

  ignore = JSON.parse(fs.readFileSync(path.join(__dirname, ".couchappignore")).toString());
  loadFileOptions = {ignore: ignore};

  validateDocUpdate = function(newDoc, savedDoc, userCtx){

    // List of roles authorized to submit documents to the database. Roles must be added
    // by an admin to new accounts.
    var authorizedRoles = ["_admin", "Breast", "Gi", "Gyn Onc", "Head And Neck", "Lung", "Lymp And Leuk", "Neuro Onc", "Thoracic", "Urology"];

    function required (field, message /* optional */) {
      message = message || "Document must have a " + field;
      if (!newDoc[field] || newDoc[field] === "") throw({forbidden : message});
    }

    function arrayIntersection (a, b) {
      return a.filter(function (el) {
        if (b.indexOf(el) === -1) return false;
        else return true;
      });
    }

    // Ensure the user is logged in, and that they have at least one of the authorized roles.
    if (!userCtx.name) {
      throw({forbidden : "You must be logged in to complete that action."});
    } else if (arrayIntersection(userCtx.roles, authorizedRoles).length <= 0){
      throw({forbidden : "You do not have sufficient permission to complete that action."});
    }

    // Ensure that the user has particular permission to edit the document in question, and
    // that all required fields are present.
    if(newDoc.type === "data_management_form"){
      if(newDoc.opername !== userCtx.name && userCtx.roles.indexOf("_admin") === -1){
        throw({forbidden : "You may only edit records you entered."});
      }
      required("medrec", "Medical Record Number required");
      required("ptfstnm", "Patient First Name Required");
      required("ptlstnm", "Patient Last Name Required");
      required("dtrefer", "Patient Last Name Required");
    }

  };

  var ddoc = {
    _id: '_design/dashboard',
    language : 'javascript',
    views : couchapp.loadFiles('./views', loadFileOptions),
    evently : couchapp.loadFiles('./evently', loadFileOptions),
    lists : couchapp.loadFiles('./lists', loadFileOptions),
    shows : couchapp.loadFiles('./shows', loadFileOptions),
    vendor : couchapp.loadFiles('./vendor', loadFileOptions),
    validate_doc_update : validateDocUpdate
  };

  module.exports = ddoc;
  loadAllAttachments = function (ddoc, dir){
    var listings = fs.readdirSync(dir);
    listings.forEach(function(listing){
      var file = path.join(dir, listing),
        stat = fs.statSync(file),
        prefix = "";
      if(stat.isFile()){return;}
      if(path.basename(file) === "_attachments"){
        prefix = path.dirname(file).slice(__dirname.length+1);
        couchapp.loadAttachments(ddoc, file, prefix);
      } else {
        loadAllAttachments(ddoc, file);
      }
    });
  };

  loadAllAttachments(ddoc, __dirname);
});
