import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs'
import { Command } from 'commander'
import { getFileExtension, getFileName, validatePath, readFile } from '../utils/files.js'
import { parseTimeToSeconds } from '../utils/parse-time.js'
import { ffmpegPromise } from '../utils/cli-wrappers.js'
import { rand, round } from '../utils/math.js'
import { splitWithTail } from '../utils/strings.js'
import { ydlError } from '../utils/error.js'
import { awaitAll } from '../utils/async.js'
import cliProgress from 'cli-progress'

const program = new Command()

program
	.argument( '<path>', 'file path' )
	.option(
		'-p, --output-path <path>',
		'override default output path',
		process.cwd(),
	)
	.option( '-n, --new-name <name>', 'new name for file' )
	.option( '-k, --keep-input', 'preserve the input file' )
	.option( '-s, --start-time [start]', 'starting time for cutting' )
	.option( '-e, --end-time [end]', 'ending time for cutting' )
	.option( '-t, --from-text <text-path>', 'use a text file to provide multiple times' )
	// .option(
	// 	'-l,--list-times',
	// 	'a list of times to cut.',
	// )
	.action( async ( filePath, options ) => { 
		const { newName, keepInput, startTime, endTime, fromText,  outputPath } = options

		validatePath( outputPath )

		if ( fromText ) {
			validatePath( fromText )
			const textData = readFile( fromText )

			const timeStamps = textData.map( ( line ) => {
				const [ startTime, endTime, outputName ] = splitWithTail( line, ' ', 3 ) 

				const startSeconds = parseTimeToSeconds( startTime )
				// we need some sort of marker for the end of the file, so we just use the end string in that case
				const endSeconds = endTime === 'end' ? 'end': parseTimeToSeconds( endTime ) 
				
				return [ startSeconds, endSeconds, outputName ]
			} )

			const progressBar = new cliProgress.MultiBar( { hideCursor: true, format: '[{bar}] {percentage}% | ETA: {eta}s | {name}' }, cliProgress.Presets.shades_classic )

			const cutProcess = async( inputPath, outputPath, data, multiBar ) => {
				const inputFileName = getFileName( inputPath )
				const [ , inputExt ] = getFileExtension( inputPath )
				
				const [ startTime, endTime, newOutputName ] = data

				let ffmpegCommand = ffmpeg( filePath ).outputOption( '-c:v copy' )

				const taskProgressBar = multiBar.create( 100, 0 )

				const fileName = newOutputName || `${startTime}-to-${endTime}-${inputFileName}`
				// if we are dealing with an end marker
				if ( endTime === 'end' ) {
					// don't set the duration, so it goes all the way to the end
					ffmpegCommand = ffmpegCommand.setStartTime( startTime )
				}
				else {
					ffmpegCommand = ffmpegCommand.setStartTime( startTime ).duration( endTime - startTime )

				}

				return ffmpegPromise( ffmpegCommand, `${outputPath}/${fileName}.${inputExt}`, ( data ) => { taskProgressBar.update( round( data.percent, 2 ), { name: fileName } ) }, () => { taskProgressBar.update( 100 )} )

			}

			awaitAll( timeStamps.map( ( data ) => cutProcess( filePath, outputPath, data, progressBar ) ), () => progressBar.stop(), ydlError )

		}
		else if ( !!startTime || !!endTime ) { 

			const [ , ext ] = getFileExtension( filePath )
			let tempFileName

			if ( newName ) {
				tempFileName = `${outputPath}/${newName}.${ext}`
			} else {
				const random = rand()
				const oldName = getFileName( filePath )
				tempFileName = `${outputPath}/${oldName}-${random}.${ext}`
			}

			// if we have a list of times, rather than just a start and end time
			if ( !!endTime || !!startTime ) {
				const startSeconds = startTime ? parseTimeToSeconds( startTime ) : 0
				const endSeconds = endTime ? parseTimeToSeconds( endTime ) : null

				let ffmpegCommand = ffmpeg().input( filePath ).outputOption( '-c:v copy' )

				if ( endSeconds ) {
					const length = endSeconds - startSeconds
					if ( length < 0 ) {
						endWithError(
							'Please make sure the start time is before the end time',
						)
					}
					ffmpegCommand = ffmpegCommand.setStartTime( startSeconds ).duration(
						length,
					)
				} else {
					ffmpegCommand = ffmpegCommand.setStartTime( startSeconds )
				}

				ffmpegPromise( ffmpegCommand, tempFileName, () => {}, () => {} ).then( () => {
					if ( !keepInput ) {
						fs.renameSync( tempFileName, path, () => {
							console.log( 'Overwritten file' )
						} )
					}
				} ).catch( ydlError )
			} else ydlError( 'Please provide some sort of start/end/list of times' )
		}
		else {
			ydlError( 'Please use one way of providing times' )
		}
	} )


program.parse( process.argv )
