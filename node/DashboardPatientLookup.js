var emmi = require("EMMIClient"),
		httpProxy = require('http-proxy'),
		parser = require('url').parse,
		http = require('http');

var port = process.argv[2] || 8080,
		id = process.argv[3] || "",
		password = process.argv[4] || "",
		authString = encodeURIComponent(id) + ":" + encodeURIComponent(password);

if (!id || !password) {
	console.log("ID and Password for EMMI service are required");
	console.log("Usage:");
	console.log("node DashboardPatientLookup.js <port> <ID> <password>");
	process.exit();
}

var emmiClient, options;
options = {
	"url" : "https://" + authString + "@test.horizon.hs.uab.edu/smemmi/EmmiRpcServlet",
	"id" : id,
	"password" : password,
	"externalSystem" : "IMCCP"
};
emmiClient = emmi.EMMIClient(options);

httpProxy.createServer( function (req, res, proxy) {
	var url = req.url;

	if (url.match(/\/patientLookup/)) {
		proxy.proxyRequest(req, res, {
			host : 'localhost',
			port : 9000
		});
	}
	else {
		proxy.proxyRequest(req, res, {
			host : 'localhost',
			port : 5984
		});
	}

}).listen(port);

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