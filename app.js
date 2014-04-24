var couchapp, path, fs, ignore, loadFileOptions, validateDocUpdate, loadAllAttachments;;

couchapp = require('couchapp');
path = require('path');
fs = require('fs');

ignore = JSON.parse(fs.readFileSync(path.join(__dirname, ".couchappignore")).toString());
loadFileOptions = {ignore: ignore};

validateDocUpdate = function(newDoc, savedDoc, userCtx){

    // List of roles authorized to submit documents to the database. Roles must be added
    // by an admin to new accounts.
    var authorizedRoles = ["_admin", "Breast", "Gi", "Gyn Onc", "Head And Neck", "Liver", "Lymp And Leuk", "Neuro Onc", "Thoracic", "Urology", "Pastoral"];

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

    function sameClinic (doc, user) {
        return user.roles.indexOf(doc.clinic) !== -1;
    };

    // Ensure the user is logged in, and that they have at least one of the authorized roles.
    if (!userCtx.name) {
        throw({forbidden : "You must be logged in to complete that action."});
    } else if (arrayIntersection(userCtx.roles, authorizedRoles).length <= 0){
        throw({forbidden : "You do not have sufficient permission to complete that action."});
    }

    // Ensure that the user has particular permission to edit the document in question, and
    // that all required fields are present.
    if(newDoc.type === "data_management_form"){
        if(!sameClinic(newDoc, userCtx) && userCtx.roles.indexOf("_admin") === -1 && userCtx.roles.indexOf("Pastoral") === -1){
            throw({forbidden : "You are not permitted to modify that record."});
        }
        required("medrec", "Medical Record Number required");
        required("txsurg", "Surgery Location required");
        required("txmedonc", "Chemo Location required");
        required("txradonc", "Radiation Location required");
        required("refnav", "Referral to Navigation Services required");
        required("refpastoral", "Referral to Pastoral Services required");
    }

};

var ddoc = {
    _id: '_design/dashboard',
    language : 'javascript',
    views : couchapp.loadFiles('./views', loadFileOptions),
    lists : couchapp.loadFiles('./lists', loadFileOptions),
    shows : couchapp.loadFiles('./shows', loadFileOptions),
    validate_doc_update : validateDocUpdate
};

module.exports = ddoc;
couchapp.loadAttachments(ddoc, path.join(__dirname, '_attachments'));
