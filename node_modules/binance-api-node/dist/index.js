'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _http = require('./http');

var _http2 = _interopRequireDefault(_http);

var _websocket = require('./websocket');

var _websocket2 = _interopRequireDefault(_websocket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return _extends({}, (0, _http2.default)(opts), {
    ws: (0, _websocket2.default)(opts)
  });
};