var prettyPrintError = require('./lib/flowResult').prettyPrintError;

module.exports = function (source) {
  this.cacheable();

  if (typeof (this.flowtypeCheck) !== 'function') {
    throw new Error('You need to configure FlowtypePlugin');
  }

  var callback = this.async();
  this.flowtypeCheck(this.resourcePath, function (errors, options) {
    var flowErrors = errors.map(prettyPrintError);
    if (flowErrors.length > 0) {
      flowErrors.map(this.emitError);
      if (options.failOnError) {
        throw new Error('Module failed because of a Flow error.\n'
          + flowErrors.join('\n'));
      }

    }
    callback(null, source);
  }.bind(this));
};
