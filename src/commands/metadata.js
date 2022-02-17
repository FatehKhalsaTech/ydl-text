import ffmetadata from 'ffmetadata'
import { Command } from 'commander'
import { metaDataOptions } from '../utils/metadata.js'
import { ydlError } from '../utils/error.js'
import { validatePath } from '../utils/files.js'

const filterUndefined = ( obj ) => Object.fromEntries( Object.entries( obj ).filter( ( [ _, value ] ) => typeof value === 'string' ) )

const program = new Command()

program.argument( '<path', 'file path' )

metaDataOptions.forEach( ( [ flags, description ] ) => {
	program.option( flags, description )
} )

program.action( ( filePath, opts ) => {
	validatePath( filePath )

	const { artist, album, title, track, label, date, attachment } = opts

	const data = filterUndefined( { artist, album, title, track, label, date } )
	const options = { attachments: [ attachment ] } 

	ffmetadata.write( filePath, data, options, ( err ) => {
		if ( err ) console.error( err )
		else console.log( 'Finished Metadata' )
	} )
} )

program.parse( process.argv )
