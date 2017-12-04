const util = require('util')

module.exports = function (source) {
  this.cacheable();

  const options = this.flowtypeLoaderCheckOptions;
  const checkAll = options && options.checkAll;
  const failOnError = options && options.failOnError;
  const callback = this.async();

  if (!checkAll) {
    const flowAnnotation = source.slice(0, 8);
    if (flowAnnotation !== '/* @flow' &&  flowAnnotation !== '// @flow') {
      callback(null, source);
      return;
    }
  }

  this.flowtypeLoaderCheckContent(source, this.resourcePath, function (errors, options) {
    if (errors.length > 0) {
      errors.map(this.emitError);
      if (failOnError) {
        throw new Error('Module failed because of a Flow error.\n' + errors.join('\n'));
      }
    }

    callback(null, source);
  }.bind(this));
};
