
function app_load(scripts) {
  for (var i=0; i < scripts.length; i++) {
    document.write('<script src="'+scripts[i]+'"><\/script>')
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
  "scripts/jquery.mustache.js" //my fixed version of mustache.js. Check for updates later.
]);
