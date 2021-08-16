import { Command } from "commander";
const program = new Command()

program
  .version('1.0.0')
  .description('the best cli for downloading music')
  .command('download', 'install shabads with a text file', {isDefault: true}).alias('d')
  .command('thumbnail', 'assign thumbnail to a file').alias('t')
  .command('metadata', 'assign metadata to a file').alias('m')
  .command('cut', 'cut a file with timestamps').alias('c')

program.parse(process.argv)