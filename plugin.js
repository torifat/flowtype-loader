var flowStatus = require('./lib/flowStatus');
var mainLocOfError = require('./lib/flowResult').mainLocOfError;

function FlowtypePlugin(options) {
  this._options = options || {};
  if (!this._options.cwd) {
    this._options.cwd = process.cwd();
  }
  this._resources = [];
  this._isFlowRunning = false;
  this._flowStatus = null;
}

FlowtypePlugin.prototype.getFlowStatus = function () {
  if (this._isFlowRunning) {
    return true;
  }

  this._isFlowRunning = true;

  flowStatus(this._options.cwd, function (status) {
    this._flowStatus = status;
    this._isFlowRunning = false;
    this._notifyResources();
  }.bind(this));
};

FlowtypePlugin.prototype.addResource = function (resourcePath, callback) {
  var resource = {path: resourcePath, callback: callback};
  if (this._isFlowRunning) {
    this._resources.push(resource);
  } else {
    this._notifyResourceError(resource);
  }
};

FlowtypePlugin.prototype.clearResources = function () {
  this._resources = [];
};

FlowtypePlugin.prototype._notifyResources = function () {
  for (var i = 0; i < this._resources.length; i++) {
    var resource = this._resources[i];
    this._notifyResourceError(resource);
  }
  this.clearResources();
};

FlowtypePlugin.prototype._notifyResourceError = function(resource) {
  if (resource.callback) {
    var errors = [];
    if (this._flowStatus && !this._flowStatus.passed) {
      errors = this._flowStatus.errors.filter(function (error) {
        var mainLoc = mainLocOfError(error);
        var mainFile = mainLoc && mainLoc.source;
        return mainFile === resource.path;
      });
    }
    resource.callback(errors, this._options);
  }
};

FlowtypePlugin.prototype.apply = function (compiler) {
  var plugin = this;

  compiler.plugin('compile', function () {
    plugin.clearResources();
    plugin.getFlowStatus();
  });

  compiler.plugin('compilation', function (compilation) {
    compilation.plugin('normal-module-loader', function (context, module) {
      context.flowtypeCheck = function(resourcePath, callback) {
        plugin.addResource(resourcePath, callback);
      };
    });
  });
};

module.exports = FlowtypePlugin;
