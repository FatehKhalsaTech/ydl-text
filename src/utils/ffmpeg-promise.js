// From https://stackoverflow.com/a/64537501
import { ydlError } from './error.js'
export const ffmpegPromise = ( command, saveToName, progressCallback, endCallback ) =>
	new Promise( ( resolve, reject ) => {
		command.clone()
			.on( 'progress', progressCallback )
			.on( 'end', () => {
				endCallback()
				resolve()
			} )
			.on( 'error', ( err ) => {
				return reject(
					ydlError( err )
				)
			} )
			.save( saveToName )
	} )
