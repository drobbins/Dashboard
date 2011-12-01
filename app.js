var requirejs=require('requirejs');
requirejs.config({nodeRequire: require});

requirejs(['couchapp', 'path', 'fs'], function(couchapp, path, fs){
    var ignore = JSON.parse(fs.readFileSync(path.join(__dirname, ".couchappignore")).toString()),
        loadFileOptions = {ignore: ignore};
    var ddoc = {
        _id: '_design/dashboard2',
        views : couchapp.loadFiles('./views', loadFileOptions),
        lists : {},
        shows : {},
        vendor : couchapp.loadFiles('./vendor', loadFileOptions)
    };

    module.exports = ddoc;

    couchapp.loadAttachments(ddoc, path.join(__dirname, '_attachments'));
});
