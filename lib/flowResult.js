// Compiled version of: https://github.com/facebook/flow/blob/master/tsrc/flowResult.js
// https://github.com/facebookincubator/create-react-app/issues/324#issuecomment-237058328
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.noErrors = undefined;
exports.difference = difference;
exports.prettyPrintWithHeader = prettyPrintWithHeader;
exports.prettyPrint = prettyPrint;
exports.mainLocOfError = mainLocOfError;
exports.mergedMessagesOfError = mergedMessagesOfError;
exports.prettyPrintError = prettyPrintError;
exports.prettyPrintMessageOfError = prettyPrintMessageOfError;

var _util = require("util");

var noErrors = exports.noErrors = {
  passed: true,
  errors: [],
  flowVersion: "No version"
};

// Returns a result that is a - b


function difference(a, b) {
  var oldHashes = {};
  var errors = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = b.errors[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var error = _step.value;

      var hash = JSON.stringify(error.message);
      oldHashes[hash] = error;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = a.errors[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var _error = _step2.value;

      var _hash = JSON.stringify(_error.message);
      if (oldHashes[_hash] !== undefined) {
        continue;
      }
      errors.push(JSON.parse(JSON.stringify(_error)));
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return {
    passed: errors.length === 0,
    errors: errors,
    flowVersion: a.flowVersion
  };
}

function prettyPrintWithHeader(result) {
  if (result.passed) {
    return "No errors";
  }

  return (0, _util.format)("%d error%s\n%s", result.errors.length, result.errors.length === 1 ? "" : "s", prettyPrint(result));
}

function prettyPrint(result) {
  // Copy the result so we can mess with it
  result = JSON.parse(JSON.stringify(result));
  return result.errors.map(prettyPrintError).join("\n\n");
}

function mainLocOfError(error) {
  var operation = error.operation;
  var message = error.message;

  return operation && operation.loc || message[0].loc;
}

function mergedMessagesOfError(error) {
  var level = error.level;
  var kind = error.kind;
  var message = error.message;
  var operation = error.operation;
  var trace = error.trace;
  var extra = error.extra;

  var mainLoc = mainLocOfError(error);
  var messages = [].concat(getHeader(mainLoc), getKindMessage(kind, level, message), getOpReason(operation), message, getExtraMessages(extra), getTraceReasons(trace));
  var mainFile = mainLoc && mainLoc.source || "[No file]";
  // Merge comments into blames
  return messages.reduce(function (acc, message) {
    var descr = message.descr;
    var loc = message.loc;
    var type = message.type;

    if (loc != null || acc.length == 0 || type == "Blame") {
      acc.push(message);
    } else if (descr != "Error:") {
      var prev = acc[acc.length - 1];
      prev.descr = prev.descr == "" ? descr : (0, _util.format)("%s. %s", prev.descr, descr);
    }
    return acc;
  }, []);
}

function prettyPrintError(error) {
  var mainLoc = mainLocOfError(error);
  var mainFile = mainLoc && mainLoc.source || "[No file]";
  var messages = mergedMessagesOfError(error);
  return messages.map(prettyPrintMessage.bind(null, mainFile)).join("\n");
}

function prettyPrintMessageOfError(error, message) {
  var mainLoc = mainLocOfError(error);
  var mainFile = mainLoc && mainLoc.source || "[No file]";
  return prettyPrintMessage(mainFile, message);
}

function mkComment(descr) {
  return { descr: descr, type: "Comment" };
}

function getHeader(mainLoc) {
  var line = -1;
  var filename = "[No file]";
  if (mainLoc != null) {
    var _source = mainLoc.source;
    var _start = mainLoc.start;

    line = _start.line;
    if (_source != null) {
      filename = _source;
    }
  }
  return [mkComment((0, _util.format)("%s:%d", filename, line))];
}

function getKindMessage(kind, level, message) {
  var internal_error_prefix = "Internal error (see logs): ";
  if (message.length > 0) {
    var _message$ = message[0];
    var _context = _message$.context;
    var _loc = _message$.loc;

    var _descr = null;
    if (kind == "internal" && level == "error") {
      _descr = internal_error_prefix;
    } else if (_loc != null && _loc.type == "LibFile") {
      if (kind == "parse" && level == "error") {
        _descr = "Library parse error:";
      } else if (kind == "infer") {
        _descr = "Library type error:";
      }
    }

    if (_descr != null) {
      return [{ context: _context, loc: _loc, descr: _descr, type: "Blame" }];
    }
  }
  return [];
}

function getOpReason(op) {
  if (op) {
    return [op, mkComment("Error:")];
  }
  return [];
}

function getExtraMessages(extra) {
  if (extra) {
    var messages = extra.reduce(function (acc, current) {
      var childrenMessages = current.children == null ? [] : getExtraMessages(current.children);
      var messages = acc.concat(current.message, childrenMessages);
      return messages;
    }, []);
    messages.forEach(function (message) {
      return message.indent = (message.indent || 0) + 2;
    });
    return messages;
  }
  return [];
}

function getTraceReasons(trace) {
  if (trace != null && trace.length > 0) {
    return [{ descr: "Trace:", type: "Blame" }].concat(trace);
  }
  return [];
}

function prettyPrintMessage(mainFile, _ref) {
  var context = _ref.context;
  var descr = _ref.descr;
  var loc = _ref.loc;
  var indent = _ref.indent;

  var indentation = Array((indent || 0) + 1).join(" ");
  if (loc != null) {
    var startCol = loc.start.column - 1;
    var contextStr = indentation;
    if (context != null) {
      // On Windows this might have \r
      context = context.trimRight();
      var lineStr = String(loc.start.line);
      if (lineStr.length < 3) {
        lineStr = ("   " + lineStr).slice(-3);
      }
      lineStr += ": ";
      var padding = Array(lineStr.length + 1).join(" ");
      if (context.length > startCol) {
        padding += context.substr(0, startCol).replace(/[^\t ]/g, " ");
      }
      var underline_size = loc.start.line == loc.end.line ? Math.max(1, loc.end.column - startCol) : 1;
      var underline = Array(underline_size + 1).join("^");
      contextStr = (0, _util.format)("%s%s%s\n%s%s%s ", indentation, lineStr, context, indentation, padding, underline);
    }
    var see_another_file = loc.source == mainFile ? "" : (0, _util.format)(". See: %s:%d", loc.source, loc.start.line);
    return (0, _util.format)("%s%s%s", contextStr, descr, see_another_file);
  }
  return indentation + descr;
}
