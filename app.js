var requirejs=require('requirejs');
requirejs.config({nodeRequire: require});

requirejs(['couchapp', 'path', 'fs'], function(couchapp, path, fs){

  var ignore, loadFileOptions, validateDocUpdate, loadAllAttachments;

  ignore = JSON.parse(fs.readFileSync(path.join(__dirname, ".couchappignore")).toString());
  loadFileOptions = {ignore: ignore};

  validateDocUpdate = function(newDoc, savedDoc, userCtx){

    function required(field, message /* optional */) {
      message = message || "Document must have a " + field;
      if (!newDoc[field] || newDoc[field] === "") throw({forbidden : message});
    }

    if(!userCtx.name){
      throw({forbidden : "You must be logged in to enter patient records"});
    }
    if(newDoc.type === "data_management_form"){

      if(newDoc.opername !== userCtx.name){
        throw({forbidden : "opername required to match your username"});
      }

      required("medrec", "Medical Record Number required");
      required("ptfstnm", "Patient First Name Required");
      required("ptlstnm", "Patient Last Name Required");
    }
  };

  var ddoc = {
    _id: '_design/dashboard',
    views : couchapp.loadFiles('./views', loadFileOptions),
    evently : couchapp.loadFiles('./evently', loadFileOptions),
    lists : couchapp.loadFiles('./lists', loadFileOptions),
    shows : {},
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
