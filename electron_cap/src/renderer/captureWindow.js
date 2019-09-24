import { ipcRenderer, desktopCapturer } from "electron";

function getDesktopVideoStream(sourceDisplay) {
  return new Promise((resolve, reject) => {
    desktopCapturer.getSources({ types: ["screen"] }, (error, sources) => {
      if (error) {
        return reject(error);
      }
      let targetSource;
      if (sources.length === 1) {
        targetSource = sources[0];
      } else {
        targetSource = sources.find(source => source.name === sourceDisplay.name);
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
      },
      resolve, reject);
    });
  });
}

function getCaptureImage({ videoElement, trimmedBounds, sourceDisplay }){
  // video 요소의 너비와 높이 추출하기
  const { videoWidth, videoHeight } = videoElement;

  // 캡처 대상 스트림의 출력 배율 추출하기
  const s = sourceDisplay.scaleFactor || 1;

  // video 요소 내부의 데스크톱 이미지 여백 크기 산출하기
  const blankWidth  = Math.max((videoWidth  - sourceDisplay.bounds.width  * s) / 2, 0);
  const blankHeight = Math.max((videoHeight - sourceDisplay.bounds.height * s) / 2, 0);

  // video 요소 내부의 대상 영역의 위치(x/y 좌표) 산출하기
  const offsetX = (trimmedBounds.x - sourceDisplay.bounds.x) * s + blankWidth;
  const offsetY = (trimmedBounds.y - sourceDisplay.bounds.y) * s + blankHeight;

  // canvas 요소 만들기
  const canvasElement = document.createElement("canvas");
  const context = canvasElement.getContext("2d");

  // 자를 대상 영역의 너비와 높이를 canvas 요소에 설정하기
  canvasElement.width  = trimmedBounds.width;
  canvasElement.height = trimmedBounds.height;

  // canvas 요소에 video 요소의 내용 렌더링하기
  context.drawImage(
    videoElement,
    offsetX, offsetY, trimmedBounds.width * s, trimmedBounds.height * s,
    0, 0, trimmedBounds.width, trimmedBounds.height
  );

  // canvas 요소에서 이미지 데이터 추출하기
  return canvasElement.toDataURL("image/png");
}

ipcRenderer.on("CAPTURE", (_, { sourceDisplay, trimmedBounds }) => {
  getDesktopVideoStream(sourceDisplay).then(stream => {
    // 추출한 스트림을 객체 URL로 변환하기
    const videoElement = document.createElement("video");
    videoElement.src= URL.createObjectURL(stream);
    videoElement.play();
    videoElement.addEventListener("loadedmetadata", () => {
      // video 요소에서 이미지 데이터 추출하기
      const dataURL = getCaptureImage({ videoElement, trimmedBounds, sourceDisplay });
      // Main 프로세스로 이미지 데이터 전송하기
      ipcRenderer.send("REPLY_CAPTURE", { dataURL });
      videoElement.pause();
      // 객체 URL 파기하기
      URL.revokeObjectURL(dataURL);
    });
  }).catch(error => {
    ipcRenderer.send("REPLY_CAPTURE", { error });
  });
});
