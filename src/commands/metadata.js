import ffmetadata from 'ffmetadata'
import { Command } from 'commander'
import { optsMP3, optsM4A } from '../utils/metadata-fields.js'
import { ydlError } from '../utils/error.js'
import { getFileExtension, validatePath } from '../utils/files.js'
import { atomicParsleyPromise } from '../utils/cli-wrappers.js'
import { assignDefined } from '../utils/objects.js'

const program = new Command()

program.argument( '<path', 'file path' )

optsMP3.forEach( ( [ flags, description ] ) => {
	program.option( flags, description )
} )

optsM4A.forEach( ( [ flags, description ] ) => {
	program.option( flags, description )
} )

program.action( ( filePath, opts ) => {
	validatePath( filePath )

	const truncateFileExtPrefix = ( string ) => {
		const removeExt = string.slice( 3 )
		return removeExt.charAt( 0 ).toLowerCase() + removeExt.slice( 1 )
	}
	const mp3Options = Object.entries( opts ).filter( ( [ key, ] ) => key.toLowerCase().includes( 'mp3' ) ).reduce( ( obj, [ key, val ] ) => ( { ...obj, [ truncateFileExtPrefix( key ) ]: val } ), {} )
	const m4aOptions = Object.entries( opts ).filter( ( [ key, ] ) => key.toLowerCase().includes( 'm4a' ) ).reduce( ( obj, [ key, val ] ) => ( { ...obj, [ truncateFileExtPrefix( key ) ]: val } ), {} )

	const [ , ext ] = getFileExtension( filePath )

	validatePath( filePath )

	if ( ext === 'mp3' ){
		const { artist, album, title, track, label, date, attachment } = mp3Options

		const data = assignDefined( {}, { artist, album, title, track, label, date } )
		const options = attachment ? assignDefined( {},  { attachments: [ attachment ] } ) : undefined


		if ( !attachment ) 
			ffmetadata.write( filePath, data, ( err ) => {
				if ( err ) console.error( err )
				else console.log( 'Finished Metadata' )
			} )
		else ffmetadata.write( filePath, data, options, ( err ) => {
			if ( err ) console.error( err )
			else console.log( 'Finished Metadata' )
		} )
	}

	else if ( ext === 'm4a' )  {
		atomicParsleyPromise( filePath, assignDefined( {}, m4aOptions ), {} )	
	}

	else ydlError( 'Files other than m4a or mp3 are not supported' )
} )

program.parse( process.argv )
