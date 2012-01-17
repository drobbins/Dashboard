toType = function(obj) {
        return ({}).toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
};

function load_script(uri, callback) {
    var head, script;
    if (uri === undefined || toType(uri) !== "string") {
        throw new Error("Please provide a uri parameter [string].");
    }
    if (callback === undefined || toType(callback) !== "function") {
        throw new Error("Please provide a callback parameter [function].");
    }
    head = document.body;
    script = document.createElement("script");
    script.src = uri;
    script.onload = function () {
        head.removeChild(script);
        callback(null);
    };
    script.onerror = function () {
        head.removeChild(script);
        callback({
            name: "Error",
            message: "Loading the script failed. The browser log might have more details."
        });
    };
    head.appendChild(script);
}

function app_load(scripts) {
  for (var i=0; i < scripts.length; i++) {
    document.write('<script src="'+scripts[i]+'"><\/script>');
  };
};

app_load([
  "scripts/jquery-ui.min.js",
  "scripts/underscore.js",
  "scripts/dashboard.js",
  "scripts/d3.min.js",
  "scripts/d3.behavior.min.js",
  "scripts/d3.chart.min.js",
  "scripts/d3.csv.min.js",
  "scripts/d3.geo.min.js",
  "scripts/d3.geom.min.js",
  "scripts/d3.layout.min.js",
  "scripts/d3.time.min.js",
  "scripts/bootstrap-tabs.js",
  "scripts/jquery.mustache.js" //my fixed version of mustache.js. Check for updates later.
]);
