import { Command } from 'commander'

import {siteDefaults} from '../utils/defaults.js'
import {readFile, validatePath} from '../utils/files.js'
import { realtimeYdl } from '../utils/realtime.js'

const sites = Object.entries(siteDefaults).map(([key, value]) => {
  return [key, value.alias]
})

const program = new Command()

program
  .arguments('<path>', 'path to text file')
  .arguments('[output]', 'the output location of the files', process.cwd)
  .option('-a, --audio', 'true if only download audio')
  .option('-l, --format-list', 'show a list of formats')
  .option('-t, --attach-thumbnail', 'download and attach thumbnail')
  .option('-i, --only-image', 'just get the thumbnail')

sites.forEach(([site, alias]) => {
  program.option(`--${site} [string]`, `override default format for ${site} or ${alias}`)
})

program
  .action((inputPath, outputPath, options) => {
    validatePath(inputPath)
    validatePath(outputPath)

    const links = readFile(inputPath)

    links.forEach((link) => {

      const {audio: audioOnly, attachThumbnail, onlyImage: thumbnailOnly, formatList: formatsOnly} = options

      const outputTitle = `${outputPath}/%(title)s.%(ext)s` 
      let opts
      if (!!thumbnailOnly) {
        opts = {
          output: outputTitle,
          writeThumbnail: true,
          skipDownload: true
        }
      }
      else if(!!formatsOnly) {
        opts = {
          listFormats: true,
        }  
      }
      else {
        const sourceSite = sites.find(([site, alias]) => link.includes(site) || link.includes(alias)) 
        if(!!sourceSite) {
          const [siteName] = sourceSite

         let format = siteDefaults[siteName].audio
          if(options[siteName]) format = options[siteName]
          else if (!audioOnly && !!siteDefaults[siteName].video) format = siteDefaults[siteName].video
            opts = {
              output: outputTitle,
              format,
              embedThumbnail: attachThumbnail,
            }
        }
        else {
          
          opts = {
            output: outputTitle,
            embedThumbnail:attachThumbnail,
            extractAudio: true,
            audioFormat: 'm4a',
            preferFfmpeg: true,
          }

        }

      }
      realtimeYdl(link, opts)
    })
})
program.parse(process.argv)
