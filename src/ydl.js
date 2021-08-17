import { Command } from "commander";
const program = new Command()

program
  .version('1.0.0')
  .description('mass install music')
  .command('download', 'install shabads with a text file', { executableFile: './commands/download.js'}).alias('d')
  .command('thumbnail', 'assign thumbnail to a file', {executableFile: './commands/thumbnail.js'}).alias('t')
  .command('metadata', 'assign metadata to a file', {executableFile: './commands/metadata.js'}).alias('m')
  .command('cut', 'cut a file with timestamps', {executableFile: './commands/cut.js'}).alias('c')
  .command('convert', 'either convert audio to m4a or img to jgp', {executableFile: './commands/covert.js'}).alias('f')

program.parse(process.argv)
