import { Command } from 'commander'

import { siteDefaults } from '../utils/defaults.js'
import { readFile, validatePath, getFileName } from '../utils/files.js'
import cliProgress from 'cli-progress'
import { youtubeDLPromise } from '../utils/youtube-dl.js'
import { ydlError } from '../utils/error.js'

const sites = Object.entries( siteDefaults ).map( ( [ key, value ] ) => {
	return [ key, value.alias ]
} )

const program = new Command()

const generateDowload = async ( options, outputPath,link, multiProgressBar ) => {
	const { audio: audioOnly, attachThumbnail, onlyImage: thumbnailOnly, formatList: formatsOnly } = options

	const outputTitle = `${outputPath}/%(title)s.%(ext)s` 
	let opts
	if ( thumbnailOnly ) {
		opts = {
			output: outputTitle,
			writeThumbnail: true,
			skipDownload: true
		}
	}
	else if( formatsOnly ) {
		opts = {
			listFormats: true,
		}  
	}
	else {
		const sourceSite = sites.find( ( [ site, alias ] ) => link.includes( site ) || link.includes( alias ) ) 
		if( sourceSite ) {
			const [ siteName ] = sourceSite

			let format = siteDefaults[ siteName ].audio
			if( options[ siteName ] ) format = options[ siteName ]
			else if ( !audioOnly && !!siteDefaults[ siteName ].video ) format = siteDefaults[ siteName ].video
			opts = {
				output: outputTitle,
				format,
				embedThumbnail: attachThumbnail,
			}
		}
		else {

			opts = {
				output: outputTitle,
				embedThumbnail:attachThumbnail,
				preferFfmpeg: true,
				...( !!audioOnly && {
					extractAudio: true,
					audioFormat: 'm4a',
				} ),
			}

		}

	}

	const linkProgress = multiProgressBar.create( 100, 0, { link } )

	const progressCallback = ( progressData ) => {
		linkProgress.update( progressData.percent )
		linkProgress.updateETA( progressData.eta )

	}

	const eventCallback = ( eventType, eventData ) => {
		if( eventType === 'download' && eventData.includes( 'Destination: ' ) )
			linkProgress.update( { link: getFileName( eventData.slice( 12 ) ) } )
	}
	const endCallback = () => { 
		multiProgressBar.remove( linkProgress )
	}



	await youtubeDLPromise( link, opts, progressCallback, eventCallback, endCallback )
}

// Explanation: When we read the Youtube-DL events, it doesn't differentiate which video, so then multiple bars at the same time have the same name
const executeSequentially = async ( iterable ) => {
	for ( const download of iterable ) {
		await download().catch( ydlError )
	}
}

program
	.arguments( '<path>', 'path to text file' )
	.arguments( '[output]', 'the output location of the files', process.cwd() )
	.option( '-a, --audio', 'true if only download audio' )
	.option( '-l, --format-list', 'show a list of formats' )
	.option( '-t, --attach-thumbnail', 'download and attach thumbnail' )
	.option( '-i, --only-image', 'just get the thumbnail' )

sites.forEach( ( [ site, alias ] ) => {
	program.option( `--${site} [string]`, `override default format for ${site} or ${alias}` )
} )

program
	.action( async ( inputPath, outputPath, options ) => {
		validatePath( inputPath )
		validatePath( outputPath )


		const links = readFile( inputPath )

		const multiBar = new cliProgress.MultiBar(
			{ hideCursor: true, format: '[{bar}] {percentage}% | ETA: {eta}s | {value}/{total} | {link}' },
			cliProgress.Presets.shades_classic,
		)

		const promiseArray = links.map( link => async() => generateDowload( options, outputPath, link, multiBar ) )


		executeSequentially( promiseArray ).then( () => console.log( 'lol' ) )
	} )

program.parseAsync( process.argv )
