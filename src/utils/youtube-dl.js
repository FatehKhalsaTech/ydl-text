import dargs from 'dargs'
import YoutubeDL from 'youtube-dl-wrap'
import { ydlError } from './error.js'

const youtubeDLPromise = ( link, flags, progressCallback, endCallback ) => (
	new Promise( ( resolve, reject ) => {
		new YoutubeDL().exec( [ link, ...dargs( flags, { useEquals: false } ).filter( Boolean ) ] )
			.on( 'progress', progressCallback )
			.on( 'error', ( err ) => {
				return reject( ydlError ( err ) )
			} )
			.on( 'close', () => {
				console.log( 'Download Complete' )
				endCallback()
				resolve()
			} )
	} )
)
export { youtubeDLPromise }