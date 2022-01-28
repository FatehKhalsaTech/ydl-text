import ffmpeg from 'fluent-ffmpeg'
import { Command } from "commander";
import trash from 'trash'
import { getFileExtension, getFileName, validatePath } from "../utils/files.js";
import { parseTimeToSeconds } from "../utils/parse-time.js";
import {round} from '../utils/math.js'

const program = new Command()

program
  .argument('<path>', 'path to file')
  .argument('<new-name>', 'new file name (doesnt work if you have the same name')
  .argument('<start>', 'time to start cutting')
  .argument('[end]', 'time to end cutting. Defaults to the end of the file')
  .option('-p, --output-path <path>', 'the output path', process.cwd())
  .action((filePath, name, startTime, endTime, options) => {
    let {outputPath} = options
    console.log(filePath, startTime, endTime, options)
    const [startSeconds, endSeconds] = [parseTimeToSeconds(startTime), parseTimeToSeconds(endTime)]

    validatePath(filePath)
    validatePath(outputPath)

    const {extWithoutDot} = getFileExtension(filePath)
    

    if(!!endSeconds) {
      const length = endSeconds - startSeconds
      ffmpeg(filePath) 
      // ffmpeg treats attached images as video, so we copy the image one to one with no change
      .setStartTime(startSeconds)
      .duration(length)
      .withVideoCodec('copy')
      .withAudioCodec('copy')
      .on('error', (err, stdout, stderr) => {
          console.error(`Something went wrong with ffmpeg\n${err} \n ${stdout} \n ${stderr}`)
        })
        .on('progress', (data) => {
            const { currentKbps, targetSize, timemark, percent} = data
            console.log(`${round(percent)}% done. Currently at ${timemark}, working at ${currentKbps} on the way to ${targetSize} `)
        })
        .on('end', async () => {
          console.log(`finished conversion for ${name}`)
        })
        .saveToFile(`${outputPath}/${name}.${extWithoutDot}`)

    }
    else {
      ffmpeg(filePath) 
      // ffmpeg treats attached images as video, so we copy the image one to one with no change
      .setStartTime(startSeconds)
      .withVideoCodec('copy')
      .withAudioCodec('copy')
      .on('error', (err, stdout, stderr) => {
          console.error(`Something went wrong with ffmpeg\n${err} \n ${stdout} \n ${stderr}`)
        })
        .on('progress', (data) => {
            const { currentKbps, targetSize, timemark, percent} = data
            console.log(`${round(percent)}% done. Currently at ${timemark}, working at ${currentKbps} on the way to ${targetSize} `)
        })
        .on('end', async () => {
          console.log(`finished conversion for ${name}`)
        })
        .saveToFile(`${outputPath}/${name}.${extWithoutDot}`)

    }

  })


program.parse(process.argv)
