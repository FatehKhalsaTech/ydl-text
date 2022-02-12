import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs'
import { Command } from 'commander'
import { getFileExtension, getFileName, validatePath } from '../utils/files.js'
import { parseTimeToSeconds } from '../utils/parse-time.js'
import { ffmpegPromise } from '../utils/ffmpeg-promise.js'
import { rand } from '../utils/math.js'
import { ydlError } from '../utils/error.js'

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
	.option(
		'-l,--list-times',
		'a list of times to cut. Starts at 0:00 and ends at end of file',
	)
	.action( async ( filePath, options ) => {
		let { outputPath, newName, keepInput, startTime, endTime, listTimes } =
      options
		console.log( filePath, options )

		validatePath( filePath )
		validatePath( outputPath )

		const { extWithoutDot } = getFileExtension( filePath )

		let tempFileName

		if ( newName ) {
			tempFileName = `${outputPath}/${newName}.${extWithoutDot}`
		} else {
			const random = rand()
			const oldName = getFileName( filePath )
			tempFileName = `${outputPath}/${oldName}-${random}.${extWithoutDot}`
		}

		// if we have a list of times, rather than just a start and end time
		if ( listTimes ) {}
		else if ( !!endTime || !!startTime ) {
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

			ffmpegPromise( ffmpegCommand, tempFileName ).then( () => {
				if ( !keepInput ) {
					fs.renameSync( tempFileName, path, () => {
						console.log( 'Overwritten file' )
					} )
				}
			} ).catch( console.log )
		} else endWithError( 'Please provide some sort of start/end/list of times' )
	} )
program.parse( process.argv )
