import { Command } from 'commander'
import cliProgress from 'cli-progress'

import { siteDefaults } from '../utils/defaults.js'
import { readFile, validatePath, getFileName } from '../utils/files.js'
import { youtubeDLPromise } from '../utils/cli-wrappers.js'
import { executeSequentially, retry } from '../utils/async.js'	
import { getYoutubeVideoID } from '../utils/youtube-urls.js'

import * as ytInfo from 'youtube-info-streams'

const sites = Object.entries( siteDefaults ).map( ( [ key, value ] ) => {
	return [ key, value.alias ]
} )
const generateDowload = async ( options, outputPath,link, multiProgressBar ) => {
	const { audio: audioOnly, attachThumbnail, onlyImage: thumbnailOnly, formatList: formatsOnly, format } = options

	const ytVideoID = getYoutubeVideoID( link )
	const videoInfo = ytInfo( ytVideoID ) 
	const { videoDetails: { title: videoTitle } } = videoInfo

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

			let downloadFormat = siteDefaults[ siteName ].audio
			if( format ) downloadFormat = options[ siteName ]
			else if ( !audioOnly && !!siteDefaults[ siteName ].video ) downloadFormat = siteDefaults[ siteName ].video
			opts = {
				output: outputTitle,
				format: downloadFormat,
				// writeThumbnail: squareThumbnail && !attachThumbnail,
				embedThumbnail:attachThumbnail,
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
			linkProgress.update( { link:  eventData.slice( 12 )  } )
	}
	const endCallback = () => { 
		multiProgressBar.remove( linkProgress )
	}

	await retry( youtubeDLPromise, 3, videoTitle, link, opts, progressCallback, eventCallback, endCallback )
}


const program = new Command()
program
	.argument( '<path>', 'path to text file' )
	.argument( '[output]', 'the output location of the files', process.cwd() )
	.option( '-a, --audio', 'true if only download audio' )
	.option( '-l, --format-list', 'show a list of formats' )
	// .option( '-s, --square-thumbnail', 'embed square thumbnail' )
	.option( '-f, --override-format', 'override default format' )
	.option( '-t, --attach-thumbnail', 'download and attach thumbnail' )
	.option( '-i, --only-image', 'just get the thumbnail' )


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


		executeSequentially( promiseArray ).then( () => multiBar.stop()  )
	} )

program.parseAsync( process.argv )
