import ydl from "youtube-dl-exec";

export const realtime = (link, opts) => (
  ydl.raw(link, opts).stdout.pipe(process.stdout)
)