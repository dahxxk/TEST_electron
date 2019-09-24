import { app } from "electron";
import createMainWindow from "./createMainWindow";

let mainWindow = null;

app.on("ready", () => {
  mainWindow = createMainWindow();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
      }
    });

app.on("activate", (_e, hasVisibleWindows) => {
    if (!hasVisibleWindows) {
      mainWindow = createMainWindow();
    }
  });