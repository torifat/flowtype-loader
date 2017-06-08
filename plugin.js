const flowCheckConetent = require('./lib/flowCheckContent');
const prettyPrintError = require('./lib/flowResult').prettyPrintError;

function FlowtypePlugin(options) {
  this._options = options || {};
}

FlowtypePlugin.prototype.apply = function (compiler) {
  const plugin = this;

  compiler.plugin('compilation', function (compilation) {
    compilation.plugin('normal-module-loader', function (context, module) {
      context.flowtypeLoaderCheckOptions = plugin._options;
      context.flowtypeLoaderCheckContent = function(content, path, callback) {
        flowCheckConetent(content, path, function(result) {
          const errors = result.errors.map(prettyPrintError);
          callback(errors);
        })
      };
    });
  });
};

module.exports = FlowtypePlugin;
