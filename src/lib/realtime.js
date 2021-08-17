import ydl from "youtube-dl-exec";
import { apRaw } from "./atomic-parsley";

export const realtimeYdl = (link, flags, opts) => (
  ydl.raw(link, flags, opts).stdout.pipe(process.stdout)
)

export const realtimeAP = (path, flags, opts) => (
  apRaw(path, flags, opts).stdout.pipe(process.stdout)
)