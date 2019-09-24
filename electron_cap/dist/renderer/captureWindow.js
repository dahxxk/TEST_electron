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
/******/ 	return __webpack_require__(__webpack_require__.s = 192);
/******/ })
/************************************************************************/
/******/ ({

/***/ 12:
/***/ (function(module, exports) {

module.exports = require("electron");

/***/ }),

/***/ 192:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _electron = __webpack_require__(12);

function getDesktopVideoStream(sourceDisplay) {
  return new Promise(function (resolve, reject) {
    _electron.desktopCapturer.getSources({ types: ["screen"] }, function (error, sources) {
      if (error) {
        return reject(error);
      }
      var targetSource = void 0;
      if (sources.length === 1) {
        targetSource = sources[0];
      } else {
        targetSource = sources.find(function (source) {
          return source.name === sourceDisplay.name;
        });
      }
      if (!targetSource) {
        return reject({ message: "No available source" });
      }
      // 스트림 객체 추출하기
      navigator.webkitGetUserMedia({
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: "desktop",
            chromeMediaSourceId: targetSource.id,
            minWidth: 100,
            minHeight: 100,
            maxWidth: 4096,
            maxHeight: 4096
          }
        }
      }, resolve, reject);
    });
  });
}

function getCaptureImage(_ref) {
  var videoElement = _ref.videoElement,
      trimmedBounds = _ref.trimmedBounds,
      sourceDisplay = _ref.sourceDisplay;

  // video 요소의 너비와 높이 추출하기
  var videoWidth = videoElement.videoWidth,
      videoHeight = videoElement.videoHeight;

  // 캡처 대상 스트림의 출력 배율 추출하기

  var s = sourceDisplay.scaleFactor || 1;

  // video 요소 내부의 데스크톱 이미지 여백 크기 산출하기
  var blankWidth = Math.max((videoWidth - sourceDisplay.bounds.width * s) / 2, 0);
  var blankHeight = Math.max((videoHeight - sourceDisplay.bounds.height * s) / 2, 0);

  // video 요소 내부의 대상 영역의 위치(x/y 좌표) 산출하기
  var offsetX = (trimmedBounds.x - sourceDisplay.bounds.x) * s + blankWidth;
  var offsetY = (trimmedBounds.y - sourceDisplay.bounds.y) * s + blankHeight;

  // canvas 요소 만들기
  var canvasElement = document.createElement("canvas");
  var context = canvasElement.getContext("2d");

  // 자를 대상 영역의 너비와 높이를 canvas 요소에 설정하기
  canvasElement.width = trimmedBounds.width;
  canvasElement.height = trimmedBounds.height;

  // canvas 요소에 video 요소의 내용 렌더링하기
  context.drawImage(videoElement, offsetX, offsetY, trimmedBounds.width * s, trimmedBounds.height * s, 0, 0, trimmedBounds.width, trimmedBounds.height);

  // canvas 요소에서 이미지 데이터 추출하기
  return canvasElement.toDataURL("image/png");
}

_electron.ipcRenderer.on("CAPTURE", function (_, _ref2) {
  var sourceDisplay = _ref2.sourceDisplay,
      trimmedBounds = _ref2.trimmedBounds;

  getDesktopVideoStream(sourceDisplay).then(function (stream) {
    // 추출한 스트림을 객체 URL로 변환하기
    var videoElement = document.createElement("video");
    videoElement.src = URL.createObjectURL(stream);
    videoElement.play();
    videoElement.addEventListener("loadedmetadata", function () {
      // video 요소에서 이미지 데이터 추출하기
      var dataURL = getCaptureImage({ videoElement: videoElement, trimmedBounds: trimmedBounds, sourceDisplay: sourceDisplay });
      // Main 프로세스로 이미지 데이터 전송하기
      _electron.ipcRenderer.send("REPLY_CAPTURE", { dataURL: dataURL });
      videoElement.pause();
      // 객체 URL 파기하기
      URL.revokeObjectURL(dataURL);
    });
  }).catch(function (error) {
    _electron.ipcRenderer.send("REPLY_CAPTURE", { error: error });
  });
});

/***/ })

/******/ });
//# sourceMappingURL=captureWindow.js.map