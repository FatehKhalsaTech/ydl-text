import { Command } from "commander";
import { siteDefaults } from "../lib/defaults.js";

const program = new Command()

const sites = Object.keys(siteDefaults)

program
  .version('1.0.0')
  .description('the best cli for downloading music')

program
  .command('download')
  .alias('d')
  .description('download the shabad audio with a text file')
  .arguments('<path>', 'the path a text file containing the links to the music, separated by a new line')
  .option('-o', '--output', 'the output location')

program
  .command('thumbnail')
  .alias('t')
  .description('assign thumbnail to a file')
  // .command('download', 'install shabads with a text file', {isDefault: true}).alias('d')
  // .command('thumbnail', 'assign thumbnail to a file').alias('t')
  // .command('metadata', 'assign metadata to a file').alias('m')
  // .command('cut', 'cut a file with timestamps').alias('c')

program.parse(process.argv)