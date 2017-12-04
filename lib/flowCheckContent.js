const flowBin = require('flow-bin');
const spawn = require('child_process').spawn;

const flowCheckConetent = (content, path, callback) => {
  const flow = spawn(flowBin, ['check-contents', path, '--show-all-errors', '--json']);
  var result = '';

  flow.stdout.on('data', function (data) {
    result += data.toString();
  });

  flow.stderr.on('data', function (data) {
    throw new Error(data.toString());
  });

  flow.on('error', function (e) {
    throw e;
  });

  flow.on('close', function (code) {
    if (code !== 12 && result !== '') {
      try {
        callback(JSON.parse(result));
      } catch (e) {
        throw e;
      }
    } else {
      callback(null);
    }
  });

  try {
    flow.stdin.write(content);
    flow.stdin.end();
  } catch (e) {
    throw e;
  }

};

module.exports = flowCheckConetent;
