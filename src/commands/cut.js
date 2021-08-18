import ffmpeg from 'fluent-ffmpeg'
import { Command } from "commander";
import { getFileName } from "../utils/files.js";
import { parseTimeToSeconds } from "../utils/parse-time.js";
import { endWithError } from '../utils/error.js'

const program = new Command()

program
  .argument('<path>', 'path to file')
  .argument('<start>', 'time to start cutting')
  .argument('[end]', 'time to end cutting. Defaults to the end of the file')
  .option('-o, --output <path>', 'the output path')
  .option('-n, --name <name>', 'new name for the output file')
  .option('-f, --format <format>', 'set the format, default is m4a', 'm4a')
  .action((filePath, startTime, endTime, options) => {
    const {output: outputPath, name: newName, format: outputFormat} = options
    validatePath(filePath)
    !!outputPath && validatePath(outputPath)

    const startSeconds = parseTimeToSeconds(startTime)

    const oldName = getFileName(path)
    let output
    // wow first time actually applying demorgans law since ap csa
    if (!! (outpuPath || newName)) output = `${outputPath}/${newName}.${outputFormat}`
     else if (!!newName) output = `${newName}.${outputFormat}`
     else output = `${oldName}.${outputFormat}`

    if (!!endTime) {
      const endSeconds = parseTimeToSeconds(endTime)
      const duration = endSeconds - startSeconds
      
      ffmpeg()
        .input(path)
        .audioCodec('aac')
        .setStartTime(startTime)
        .duration(duration)
        .saveToFile(output)
        .on('error', (err) => {
          endWithError(`Something went wrong with ffmpeg\n${err}`)
        })
        .on('progress', (data) => {
            const { currentKbps, targetSize, timemark, percent} = data
            console.log(`${percent}% done. Currently at ${timemark}, working at ${currentKbps} on the way to ${targetSize} `)
        })
        .on('end', () => {
          console.log('finished conversion')
        })


    }
    else {
      ffmpeg()
        .input(path)
        .audioCodec('aac')
        .setStartTime(startTime)
        .saveToFile(output)
    }
  })


program.parse(process.argv)