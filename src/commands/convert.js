import trash from 'trash'
import ffmpeg from 'fluent-ffmpeg'
import sharp from 'sharp'
import { Command } from 'commander'
import { getFileName, validatePath } from '../utils/files.js'
import { round } from '../utils/math.js'
import { ydlError } from '../utils/error.js'
import { ffmpegPromise } from '../utils/cli-wrappers.js'
import cliProgress from 'cli-progress'

const formatCodec = {
	ogg: [ 'libvorbis' ],
	mp3: [ 'libmp3lame' ]
}
const program = new Command()
program
	.argument( '<filepath>', 'path to file' )
	.option( '-t, --type <filetype>', 'img or audio', 'audio' )
	.option(
		'-f, --format <fileformat>',
		'override the default conversion format (m4a for audio and jpg for images',
	)
	.option( '-p, --output-path <outpath>', 'path to write file to', process.cwd() )
	.option( '-n, --name <name>', 'new name' )
	.action( ( path, options ) => {
		validatePath( path )
		const { type: fileType, name: newName, outputPath } = options

		switch ( fileType ) {
		case 'audio': {
			const { format: outputFormat = 'm4a' } = options
			const fileName = newName || getFileName( path )
			validatePath( outputPath )

			const progressBar = new cliProgress.SingleBar( { hideCursor: true }, cliProgress.Presets.shades_classic )


			let command = ffmpeg( path ).on( 'progress', function( progress ) {
				console.log( 'Processing: ' + progress.percent + '% done' )
			} )
			
			if( formatCodec?.[ outputFormat ] ){
				formatCodec?.[ outputFormat ].forEach( opt => {
					command = command.outputOption( `-acodec ${opt}` )
				} )
			}
			// ffmpeg treats attached images as video, so we copy the image one to one with no change
			command = command
				.outputOption( '-c:v copy' )
				.outputOption( '-map_metadata 0' )

			ffmpegPromise( command, `${outputPath}/${fileName}.${outputFormat}`, ( data ) =>{ progressBar.update( round( data.percent, 0 ) ) }, () => {} ).then( async () => await trash( path ) )

			break
		}
		case 'img': {
			const { format: outputFormat = 'jpg' } = options
			const fileName = newName || getFileName( path )

			sharp( path )
				.toFile( `${outputPath}/${fileName}.${outputFormat}` )
			break
		}
		default: {
			ydlError( 'File type provided for conversion was invalid' )
			break
		}
		}
	} )

program.parse( process.argv )
