var requirejs=require('requirejs');
requirejs.config({nodeRequire: require});

requirejs(['couchapp', 'path', 'fs'], function(couchapp, path, fs){
    var ignore = JSON.parse(fs.readFileSync(path.join(__dirname, ".couchappignore")).toString()),
        loadFileOptions = {ignore: ignore},
        validate_doc_update = function(newDoc, savedDoc, userCtx){
            if(!userCtx.name){
              throw({forbidden : "You must be logged in to enter patient records"});
            }
            if(newDoc.type === "data_managment_form"){
              if(newDoc.opername !== userCtx.name){
                throw({forbidden : "opername required to match your username"});
              }
            }
        };
    var ddoc = {
        _id: '_design/dashboard',
        views : couchapp.loadFiles('./views', loadFileOptions),
        evently : couchapp.loadFiles('./evently', loadFileOptions),
        lists : couchapp.loadFiles('./lists', loadFileOptions),
        shows : {},
        vendor : couchapp.loadFiles('./vendor', loadFileOptions),
        validate_doc_update : validate_doc_update
    };

    module.exports = ddoc;
    function loadAllAttachments(ddoc, dir){
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
    }

    loadAllAttachments(ddoc, __dirname);
});
