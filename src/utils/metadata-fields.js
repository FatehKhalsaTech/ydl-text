// back when m4a metadata was working, now we need this hacky workaround
// export const metadataOpts = [
// 	[ '-s, --artist [artist]', 'artist name' ],
// 	[ '-a, --album [album]', 'album name' ],
// 	[ '-t, --title [title]', 'song title' ],
// 	[ '-n ,--track [trackno]', 'track number' ],
// 	[ '-l, --label [label]', 'record label' ],
// 	[ '-d, --date [date]', 'pretty much anything, but usually just a year' ],
// 	[ '-i, --attachment [attachment]', 'path to image attachment' ],
// ]
export const optsMP3 = [
	[ '--mp3-artist [artist]', 'artist name' ],
	[ '--mp3-album [album]', 'album name' ],
	[ '--mp3-title [title]', 'song title' ],
	[ '--mp3-track [trackno]', 'track number' ],
	[ '--mp3-label [label]', 'record label' ],
	[ '--mp3-date [date]', 'pretty much anything, but usually just a year' ],
	[ '--mp3-attachment [attachment]', 'path to image attachment' ],
]

export const optsM4A = [
	 [ '--m4a-test', 'test if file is mp4' ],
	[ '--m4a-textdata', 'print the metadata tags' ],
	[ '--m4a-artist <artist>', 'set the artist of the file' ],
	[ '--m4a-title <title>', 'set the title of the file' ],
	[ '--m4a-genre <genre>', 'set the genre of the file' ],
	[ '--m4a-tracknum <tracknum>', 'set the track number of the file' ],
	[ '--m4a-comment <comment>', 'set the comment for the file' ],
	[ '--m4a-year <year>', 'set the year of the file' ],
	[ '--m4a-composer <composer>', 'set the composer of the file' ],
	[ '--m4a-copyright <copyright>', 'set the copyright of the file' ],
	[ '--m4a-artwork <artwork>', 'set the artwork of the file' ],
	[ '--m4a-albumArtist <artist>', 'set the artist of the file' ],
	[ '--m4a-description <description>', 'set the description of the file' ],
	[ '--no-m4a-overWrite', 'over write file (no temp file)' ],
]
