# YDL-Text

A (pretty much) all encompassing cli wrapper for FFMpeg and YoutubeDL in downloading music from online. Curated for the main intent of downloading kirtan.

## Installation

Currently, this project is in nodejs, so there is no available executable install. A Rust rewrite is planned to support that, but for now, only NPM install is available

` $ npm install ydl-text`


You also need [`youtube-dl`](https://ytdl-org.github.io/youtube-dl/download.html) and [`ffmpeg`](https://ffmpeg.org/download.html) installed. 



## Commands
This package has four main commands: Download, Cut, Metadata, and Convert
``` 
Usage: ydl-text [options] [command]

mass install music

Options:
  -V, --version   output the version number
  -h, --help      display help for command

Commands:
  download|d      install shabads with a text file
  metadata|m      assign metadata to a file
  cut|c           cut a file with timestamps
  convert|f       either convert audio to m4a or img to jgp
  help [command]  display help for Commands
```

### Download 

```
ydl-text d -h
Usage: download [options] <path> [output]

Options:
  -a, --audio             download only audio (no video)
  -l, --format-list       show a list of formats available to download
  -t, --attach-thumbnail  download and attach thumbnail
  -i, --only-image        download only the thumbnail
  --youtube [string]      override default format for youtube or youtu.be
  --soundcloud [string]   override default format for soundcloud or undefined
  --instagram [string]    override default format for instagram or undefined
  -h, --help              display help for commands
```
The download command is a wrapper for `youtube-dl` (or `yt-dlp` if you create an alias in your shell). 

This command does not currently support all youtube-dl flags, although it is planned [here](https://github.com/FatehKhalsaTech/ydl-text/issues/8).

**Note: Due to some issues (mainly minor issues regarding displaying the correct data with the progress bar), this script downloads videos one by one (although to be honest, it pretty much did downlod those videos one by one anyways even when it supported the async tasks running concurrently)



