import os from 'os'
import ffmpeg from 'fluent-ffmpeg'
import sharp from 'sharp'
import { Command } from 'commander'
import { getFileName, validatePath } from '../lib/files.js'
import { argError, endWithError } from '../lib/error.js'

const program = new Command()

program
  .argument('<path>', 'path to file')
  .argument('<output>', 'output location, otherwise it will use the current directory', process.cwd)
  .argument('[name]', 'optionally change the name')
  .option('-t, --type <filetype>'  , 'what type of file is this? img or audio', 'audio' )
  .option('-f, --format <output-format>', 'override the default conversion format (m4a for audio and jpg for images)')
  .action((path, outputPath, newName, options) => {
    validatePath(path)
    const {type: fileType} = options
    
    switch(fileType) {
      case 'audio': {
        const {format: outputFormat = 'm4a'} = options
        const fileName = newName || getFileName(path)

        validatePath(`${outputPath}`)
        ffmpeg()
          .input(path)
          .audioCodec('aac')
          .on('error', (err) => {
            endWithError(`Something went wrong with ffmpeg\n${err}`)
          })
          .on('progress', (data) => {
              const { currentFps,  currentKbps, targetSize, timemark, percent} = data
              console.log(`${percent}% done. Currently at ${timemark}, working at ${currentKbps} on the way to ${targetSize} `)
          })
          .on('end', () => {
            console.log('finished conversion')
          })
          .saveToFile(`${outputPath}/${fileName}.${outputFormat}`)
        break
      }
      case 'img': {
        const {format: outputFormat = 'jpg'} = options
        const fileName = newName || getFileName(path)

        sharp(path)
          .toFile(`${outputPath}/${fileName}.${outputFormat}`)
        break
      }
      default: {
        argError('File type provided for conversion was invalid')
        break
      }
    }
  })
program.parse(process.argv)