import path from "path";
import fs from "fs";
import crypto from "crypto";

function getHash(buffer) {
  const shasum = crypto.createHash("sha1");
  shasum.update(buffer);
  return shasum.digest("hex");
}

class FileManager {

  writeImage(dir, image) {
    return new Promise((resolve, reject) => {
      const buffer = image.toPNG();
      const filename = path.join(dir, `${getHash(buffer)}.png`);
      fs.writeFile(filename, buffer, error => {
        if (error) {
          reject(error);
        } else {
          resolve(filename);
        }
      });
    });
  }

  readAsBase64string(filename) {
    return new Promise((resolve, reject) => {
      fs.readFile(filename, { encoding: "base64" }, (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
  }
}

function createFileManager() {
  return new FileManager();
}

export default createFileManager;
