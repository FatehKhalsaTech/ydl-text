// From https://stackoverflow.com/a/64537501
import { endWithError } from "../utils/error.js";
import { round } from "../utils/math.js";
export const ffmpegPromise = (command, saveToName) =>
  new Promise((resolve, reject) => {
    command.clone()
      .on("progress", (data) => {
        const { currentKbps, targetSize, timemark, percent } = data;
        console.log(
          `${
            round(percent)
          }% done. Currently at ${timemark}, working at ${currentKbps} on the way to ${targetSize} `,
        );
      })
      .save(saveToName)
      .on("end", () => {
        console.log("processing finished");
        resolve();
      })
      .on("error", (err, stdout, stderr) => {
        return reject(
          endWithError(
            `Something went wrong with ffmpeg\n${err} \n ${stdout} \n ${stderr}`,
          ),
        );
      });
  });
