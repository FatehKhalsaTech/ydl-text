import trash from 'trash'
import ffmpeg from 'fluent-ffmpeg'
import sharp from 'sharp'
import { Command } from 'commander'
import { getFileName, validatePath } from '../utils/files.js'
import { round } from '../utils/math.js'
import { ydlError } from '../utils/error.js'

argError
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

			ffmpeg( path )
			// ffmpeg treats attached images as video, so we copy the image one to one with no change
				.outputOption( '-c:v copy' )
				.on( 'error', ( err, stdout, stderr ) => {
					console.error(
						`Something went wrong with ffmpeg\n${err} \n ${stdout} \n ${stderr}`,
					)
				} )
				.on( 'progress', ( data ) => {
					const { currentKbps, targetSize, timemark, percent } = data
					console.log(
						`${
							round( percent )
						}% done. Currently at ${timemark}, working at ${currentKbps} on the way to ${targetSize} `,
					)
				} )
				.on( 'end', async () => {
					console.log( `finished conversion for ${fileName}` )
					await trash( path )
				} )
				.saveToFile( `${outputPath}/${fileName}.${outputFormat}` )

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
			argError( 'File type provided for conversion was invalid' )
			break
		}
		}
	} )

program.parse( process.argv )
