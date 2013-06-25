// TODO - convert this to something prettier - like express.

var emmi = require("EMMIClient"),
    httpProxy = require('http-proxy'),
    parser = require('url').parse,
    http = require('http'),
    _ = require('underscore'),
    nano = require('nano');

var port = process.argv[2] || 8080,
    id = process.argv[3] || "",
    password = process.argv[4] || "",
    authString = encodeURIComponent(id) + ":" + encodeURIComponent(password),
    authorizedRoles = ["_admin", "dashboard", "Breast", "Gi", "Gyn Onc", "Head And Neck", "Lung", "Lymp And Leuk", "Neuro Onc", "Thoracic", "Urology"];

if (!id || !password) {
  console.log("ID and Password for EMMI service are required");
  console.log("Usage:");
  console.log("node DashboardPatientLookup.js <port> <ID> <password>");
  process.exit();
}


// Configure the EMMI Client

var emmiClient, options;
options = {
  "url" : "https://" + authString + "@horizon.hs.uab.edu/smemmi/EmmiRpcServlet",
  "id" : id,
  "password" : password,
  "externalSystem" : "IMCCP"
};
emmiClient = emmi.EMMIClient(options);


// Setup the proxy server

httpProxy.createServer( function (req, res, proxy) {
  var url = req.url, db, buffer, auth, cookie;

  function sendToCouch() {
    proxy.proxyRequest(req, res, {
      host : 'localhost',
      port : 5984
    });
  }

  function unauthorized() {
    res.statusCode = 401;
    res.end(JSON.stringify({
      "error" : "unauthorized",
      "reason" : "You do not have sufficient permissions to perform that action"
    }));
  }

  if (url.match(/\/patientLookup/)) {
    // Patient Lookups are proxied directly to the EMMI server.
    // Need to check the session before this.
    buffer = httpProxy.buffer(req);
    // Check the Session
    cookie = req.headers.cookie && req.headers.cookie.match(/AuthSession=[^;]+/);
    auth = cookie && cookie[0].split("=")[1];
    if (!auth) {
      unauthorized();
      return;
    }
    db = nano({
      url : "http://localhost:5984",
      cookie : "AuthSession=" + auth
    });
    db.request({ db : "_session", method : "get" }, function (err, body) {
      if (err || !body.userCtx.name) {
        unauthorized();
        return;
      }
      if (_.intersection(authorizedRoles, body.userCtx.roles).length > 0) {
        proxy.proxyRequest(req, res, {
          host : 'localhost',
          port : 9000,
          buffer : buffer
        });
      } else {
        unauthorized();
        return;
      }
    });


  } else if (req.method === "GET") {

    if (!url.match(/^\/(?:dashboard|_users|_session)/)) { // Pass through calls to other DB's, if authorized.
      buffer = httpProxy.buffer(req);
      // Check the Session
      cookie = req.headers.cookie && req.headers.cookie.match(/AuthSession=[^;]+/);
      auth = cookie && cookie[0].split("=")[1];
      if (!auth) {
        unauthorized();
        return;
      }
      db = nano({
        url : "http://localhost:5984",
        cookie : "AuthSession=" + auth
      });
      db.request({ db : "_session", method : "get" }, function (err, body) {
        if (err || !body.userCtx.name) {
          unauthorized();
          return;
        }
        if (_.intersection(["_admin"], body.userCtx.roles).length > 0) {
          sendToCouch();
        } else {
          unauthorized();
          return;
        }
      });
      return;
    } else if (url.match(/^\/[a-zA-Z0-9]+\/[^_\/]+/)) {
      // Matches any /dbname/docname, except for docs beginning in "_", such as _design/docs.
      // An attempt to directly access a data document is forced to pass through the authorize
      // show function.
      req.url = url.split("/")
        .map(function (s, i) { if (i === 2) return "_design/dashboard/_show/authorize/"+s; else return s; })
        .join("/");
      sendToCouch();
      return;
    } else if (url.match(/_design\/dashboard\/_view\/(datadates|deleted|medrecs|patient_names|stats)/)) {
      // Matches any attempt to directly access a view.
      // Even views that don't directly emit PHI need to be included in this filter,
      // since the include_docs=true query parameter could be used to get the full docs.
      // Only non-reduce views need be filtered like this.
      req.url = url.split("/")
        .map(function (s, i) {
          if (i === 4) return "_list/authorize";
          else return s;
        })
        .join("/");
      sendToCouch();
      return;
    } else if (url.match(/dashboard\/(?:_all_docs|_changes)/)) {
      // Matches any attempt to directly access CouchDB's _all_docs or _changes feeds.
      // These should be blocked through to proxy; access only permitted from the remote
      // desktop environment connecting directly to CouchDB.
      unauthorized();
    } else {
      sendToCouch();
      return;
    }

  } else {
    // Non GET methods are passed on, since write validation is handled in the
    // validate_doc_update function, and DB creation requires an _admin session.
    sendToCouch();
  }

}).listen(port);


// EMMI Lookup Server

http.createServer(function (req, res) {
  var mrn;
  mrn = parser(req.url, true).query.mrn;
  emmiClient.getPatient({ "mrn" : mrn }, function (error, results){
    if (error) {
      res.writeHead(504, { 'Content-Type': 'text/plain' });
      res.write("Unable to lookup patient; EMMI service did not respond.");
      res.end();
    }
    else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify(results.result));
      res.end();
    }
  });
}).listen(9000);
