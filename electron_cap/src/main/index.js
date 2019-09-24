import { app, shell } from "electron";
import createFileManager from "./createFileManager";
import trimDesktop from "./trimDesktop";
import createCaptureWindow from "./createCaptureWindow";

let captureWindow;

function captureAndOpenItem() {
  const fileManager = createFileManager();
  return trimDesktop()
    .then(captureWindow.capture.bind(captureWindow))
    .then(image => {
      // 임시 파일 저장 전용 폴더에 추출한 이미지 저장하기
      const createdFilename = fileManager.writeImage(app.getPath("temp"), image);
      return createdFilename;
    })
    .then(shell.openItem.bind(shell))
    .then(() => {
      if (process.platform !== "darwin") {
        app.quit();
      }
    })
  ;
}



app.on("ready", () => {
  captureWindow = createCaptureWindow();
  // captureAndOpenItem();
  captureAndOpenItem();
});
