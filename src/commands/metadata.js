import { Command } from "commander";
import { metaDataOptions } from "../utils/metadata.js";
import { realtimeAP } from "../utils/realtime.js";
import { validatePath } from '../utils/files.js'

const program = new Command()

program
  .argument('<path>', 'path to file')

metaDataOptions.forEach(([flags, description]) => {
  program.option(flags, description)
})

program
  .action((filePath, options) => {
    validatePath(filePath) 

    realtimeAP(filePath, options)
  })

program.parse(process.argv)