var flowBin = require('flow-bin');
var spawn = require('child_process').spawn;

function flowStatus(cwd, callback) {
  var flow = spawn(flowBin, ['status', '--json'], {cwd: cwd});
  var flowJson = '';

  flow.stdout.on('data', function (data) {
    flowJson += data.toString();
  });

  flow.on('error', function(e) {
    throw e;
  });

  flow.on('close', function (code) {
    if (code !== 12 && flowJson !== '') {
      try {
        callback(JSON.parse(flowJson));
      } catch (e) {
        throw e;
      }
    } else {
      callback(null);
    }
  });
}

module.exports = flowStatus;
