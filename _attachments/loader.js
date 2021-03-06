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
  }
}

app_load([
  "scripts/jquery-1.8.1.js",
  "scripts/angular.js",
  "scripts/angular-resource.min.js",
  "scripts/d3.v3.min.js",
  "scripts/topojson.js",
  "scripts/crossfilter.min.js",
  "scripts/dc.min.js",
  "scripts/bootstrap.js",
  "scripts/bootstrap-datepicker.js",
  "scripts/imccpng.js"
]);
