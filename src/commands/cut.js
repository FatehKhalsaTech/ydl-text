import ffmpeg from 'fluent-ffmpeg'
import { Command } from "commander";
import { getFileExtension, getFileName, validatePath } from "../utils/files.js";
import { parseTimeToSeconds } from "../utils/parse-time.js";
import { endWithError } from '../utils/error.js'

const program = new Command()

program
  .argument('<path>', 'path to file')
  .argument('<start>', 'time to start cutting')
  .argument('[end]', 'time to end cutting. Defaults to the end of the file')
  .option('-p, --output-path <path>', 'the output path', process.cwd())
  .option('-n, --name <name>', 'new name for the output file')
  .action((filePath, startTime, endTime, options) => {
    let {output: outputPath, name: newName, format: outputFormat} = options
    validatePath(filePath)
    !!outputPath && validatePath(outputPath)

    const startSeconds = parseTimeToSeconds(startTime)

    const oldName = getFileName(filePath)
    const {extWithoutDot: extension} = getFileExtension(filePath)
    let output
    // wow first time actually applying demorgans law since ap csa
    if (!!(outputPath || newName)) output = `${outputPath}/${newName}.${extension}`
     else if (!!newName) output = `${newName}.${extension}`
     else output = `${oldName}.${extension}`


    if (!!endTime) {
      const endSeconds = parseTimeToSeconds(endTime)
      const duration = endSeconds - startSeconds
      
      ffmpeg()
        .input(filePath)
        .outputOption('-c:v copy')
        .setStartTime(startTime)
        .duration(duration)
        .saveToFile(output)
        .on('error', (err, stdout, stderr) => {
          console.error(`Something went wrong with ffmpeg\n${stdout} \n${stderr}`)
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
        .input(filePath)
        // .audioCodec('aac')
        .setStartTime(startTime)
        .outputOption('-c:v copy')
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
  })


program.parse(process.argv)
