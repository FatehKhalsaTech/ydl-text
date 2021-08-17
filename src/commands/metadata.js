import { Command, program } from "commander";
import { realtimeAP } from "../lib/realtime";

program
  .argument('<path>', 'path to file')




program.parse(process.argv)