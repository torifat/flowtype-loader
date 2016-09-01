var prettyPrintError = require('./lib/flowResult').prettyPrintError;

module.exports = function (source) {
  this.cacheable();

  if (typeof (this.flowtypeCheck) !== 'function') {
    throw new Error('You need to configure FlowtypePlugin');
  }

  var callback = this.async();
  this.flowtypeCheck(this.resourcePath, function (errors) {
    var flowErrors = errors.map(prettyPrintError);
    if (flowErrors.length > 0) {
      flowErrors.map(this.emitError);
    }
    callback(null, source);
  }.bind(this));
};
