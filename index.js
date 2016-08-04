var execFile = require('child_process').execFile;
var flow = require('flow-bin');
var prettyPrintError = require('./lib/flowResult').prettyPrintError;
var mainLocOfError = require('./lib/flowResult').mainLocOfError;

module.exports = function (source) {
  var loader = this;
  // http://webpack.github.io/docs/how-to-write-a-loader.html#flag-itself-cacheable-if-possible
  this.cacheable && this.cacheable();
	var callback = this.async();

  execFile(flow, ['status', '--json'], {
    cwd: loader.context
  },
  function (err, res) {
    if (err) {
      // No .flowconfig found
      if (err.code !==  12) {
        try {
          var json = JSON.parse(res);
          if (!json.passed) {
            json.errors
              .filter(function (error) {
                var mainLoc = mainLocOfError(error);
                var mainFile = mainLoc && mainLoc.source;
                return mainFile === loader.resourcePath;
              })
              .map(prettyPrintError)
              .map(loader.emitError);
          }
        } catch (e) {
          throw e;
        }
      }
    }
    callback(null, source);
  });
};
