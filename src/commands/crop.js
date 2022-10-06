import { Command } from 'commander'
import sharp from 'sharp'
import fs from 'fs'	
import { getFileName, getFileExtension, validatePath } from '../utils/files.js'
import { rand } from '../utils/math.js'

const program = new Command()

program
	.argument( '<path>', 'path to text file' )
	.option( '-t, --height [height]', 'height to cut image to. defaults to 500', 500 )
	.option( '-w, --width [width]', 'weight to cut image to. defaults to 500', 500 )
	.option( '-p, --output-path [path]' , 'place to output to. defaults to process.cwd()', process.cwd() )
	.option( '-k, --keep-input' , 'keep input' )

program.action( ( filePath, options ) => {
	const { height, width, outputPath, keepInput } = options

	validatePath( filePath )	
	const fileName = getFileName( filePath )
	const [ , ext ] = getFileExtension( filePath )
	const randomNum = rand()

	const tempFileName = `${outputPath}/${fileName}-${randomNum}.${ext}`

	sharp( filePath )
		.resize( { height, width } )
		.toFile( tempFileName )
		.then( async () => { 
			if( !keepInput ) {
				fs.renameSync( tempFileName, filePath )
			}
		} )
} )

program.parse( process.argv )
