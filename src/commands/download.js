import { Command, program } from 'commander'
import ydl from 'youtube-dl-exec'

import {siteDefaults} from '../lib/defaults.js'
import {readFile, validatePath} from '../lib/files.js'
import { realtime } from '../lib/realtime.js'

const sites = Object.entries(siteDefaults).map(([key, value]) => {
  return [key, value.alias]
})

program
  .arguments('<path>', 'path to text file')
  .arguments('[output]', 'the output location of the files', process.cwd)
  .option('-a', '--audio', 'true if only download audio')
  .option('-l', '--format-list', 'show a list of formats')
  .option('-t', '--attach-thumbnail', 'download and attach thumbnail')
  .option('-i', '--only-image', 'just get the thumbnail')

sites.forEach(([site, alias]) => {
  program.option(`--${site} [string]`, `override default format for ${site} or ${alias}`)
})

program
  .action((inputPath, outputPath, options) => {
    validatePath(inputPath)
    validatePath(outputPath)

    const links = readFile(inputPath)

    links.forEach((link) => {

      const {a: audioOnly, t: attachThumbnail, i: thumbnailOnly, l: formatsOnly} = options
      let opts
      if (!!thumbnailOnly) {
        opts = {
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
        const [siteName] = sourceSite

        let format = siteDefaults[siteName].audio
        if(options[siteName]) format = options[siteName]
        else if (!audioOnly && !!siteDefaults[siteName].video) format = siteDefaults[siteName].video

        opts = {
          output: `${outputPath}/%(title)s.%(ext)s`,
          format,
          embedThumbnail: attachThumbnail,
        }
      }
      realtime(link, opts)
    })
})
program.parse(process.argv)
