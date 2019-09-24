/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 190);
/******/ })
/************************************************************************/
/******/ ({

/***/ 12:
/***/ (function(module, exports) {

module.exports = require("electron");

/***/ }),

/***/ 187:
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),

/***/ 188:
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ 189:
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ 190:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _electron = __webpack_require__(12);

var _createFileManager = __webpack_require__(83);

var _createFileManager2 = _interopRequireDefault(_createFileManager);

var _trimDesktop = __webpack_require__(84);

var _trimDesktop2 = _interopRequireDefault(_trimDesktop);

var _createCaptureWindow = __webpack_require__(82);

var _createCaptureWindow2 = _interopRequireDefault(_createCaptureWindow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var captureWindow = void 0;

function captureAndOpenItem() {
  var fileManager = (0, _createFileManager2.default)();
  return (0, _trimDesktop2.default)().then(captureWindow.capture.bind(captureWindow)).then(function (image) {
    // 임시 파일 저장 전용 폴더에 추출한 이미지 저장하기
    var createdFilename = fileManager.writeImage(_electron.app.getPath("temp"), image);
    return createdFilename;
  }).then(_electron.shell.openItem.bind(_electron.shell)).then(function () {
    if (process.platform !== "darwin") {
      _electron.app.quit();
    }
  });
}

_electron.app.on("ready", function () {
  captureWindow = (0, _createCaptureWindow2.default)();
  // captureAndOpenItem();
  captureAndOpenItem();
});

/***/ }),

/***/ 82:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _electron = __webpack_require__(12);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CaptureWindow = function () {
  function CaptureWindow() {
    _classCallCheck(this, CaptureWindow);

    this.win = new _electron.BrowserWindow({ show: false });
    this.win.loadURL("file://" + __dirname + "/../../captureWindow.html");
  }

  _createClass(CaptureWindow, [{
    key: "capture",
    value: function capture(clippingProfile) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        _electron.ipcMain.once("REPLY_CAPTURE", function (_, _ref) {
          var error = _ref.error,
              dataURL = _ref.dataURL;

          if (error) {
            reject(error);
          } else {
            // 이미지 데이터(base64 문자열)을 NativeImage 형식으로 변환하기
            resolve(_electron.nativeImage.createFromDataURL(dataURL));
          }
        });
        _this.win.webContents.send("CAPTURE", clippingProfile);
      });
    }
  }, {
    key: "close",
    value: function close() {
      this.win.close();
    }
  }]);

  return CaptureWindow;
}();

function createCaptureWindow() {
  return new CaptureWindow();
}

exports.default = createCaptureWindow;

/***/ }),

/***/ 83:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = __webpack_require__(189);

var _path2 = _interopRequireDefault(_path);

var _fs = __webpack_require__(188);

var _fs2 = _interopRequireDefault(_fs);

var _crypto = __webpack_require__(187);

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function getHash(buffer) {
  var shasum = _crypto2.default.createHash("sha1");
  shasum.update(buffer);
  return shasum.digest("hex");
}

var FileManager = function () {
  function FileManager() {
    _classCallCheck(this, FileManager);
  }

  _createClass(FileManager, [{
    key: "writeImage",
    value: function writeImage(dir, image) {
      return new Promise(function (resolve, reject) {
        var buffer = image.toPNG();
        var filename = _path2.default.join(dir, getHash(buffer) + ".png");
        _fs2.default.writeFile(filename, buffer, function (error) {
          if (error) {
            reject(error);
          } else {
            resolve(filename);
          }
        });
      });
    }
  }, {
    key: "readAsBase64string",
    value: function readAsBase64string(filename) {
      return new Promise(function (resolve, reject) {
        _fs2.default.readFile(filename, { encoding: "base64" }, function (error, data) {
          if (error) {
            reject(error);
          } else {
            resolve(data);
          }
        });
      });
    }
  }]);

  return FileManager;
}();

function createFileManager() {
  return new FileManager();
}

exports.default = createFileManager;

/***/ }),

/***/ 84:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _electron = __webpack_require__(12);

function trimDesktop() {
  var displays = _electron.screen.getAllDisplays();
  return new Promise(function (resolve, reject) {
    var windows = displays.map(function (display, i) {
      var _display$bounds = display.bounds,
          x = _display$bounds.x,
          y = _display$bounds.y,
          width = _display$bounds.width,
          height = _display$bounds.height;

      display.name = "Screen " + (i + 1);
      var win = new _electron.BrowserWindow({
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        x: x, y: y, width: width, height: height
      });
      win.loadURL("file://" + __dirname + "/../../index.html");
      return { win: win, display: display };
    });

    _electron.ipcMain.once("SEND_BOUNDS", function (e, _ref) {
      var trimmedBounds = _ref.trimmedBounds;

      var sourceDisplay = windows.find(function (w) {
        return w.win.webContents.id === e.sender.id;
      }).display;
      var profile = { sourceDisplay: sourceDisplay, trimmedBounds: trimmedBounds };
      windows.forEach(function (w) {
        return w.win.close();
      });
      resolve(profile);
    });
  });
}

exports.default = trimDesktop;

/***/ })

/******/ });
//# sourceMappingURL=index.js.map