import fs from "fs"

export function writeFile(content, path="./log/index.html") {
    return new Promise((resolve, reject) => {
      fs.writeFile(path, content, (err) => {
        if (err) {
          reject(err);
        } else {
          const timestamp = Date.now();
          resolve(timestamp);
        }
      });
    });
  }