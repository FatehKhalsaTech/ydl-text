import execa from 'execa'
import dargs from 'dargs'
import YoutubeDL from 'youtube-dl-wrap'
import { ydlError } from './error.js'
import { convertEmptyStrToObj, strObjectToEmptyStr } from './strings.js'

// From https://stackoverflow.com/a/64537501
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

export const youtubeDLPromise = ( link, flags, progressCallback, eventCallback, endCallback ) => (
	new Promise( ( resolve, reject ) => {
		new YoutubeDL().exec( [ link, ...dargs( flags, { useEquals: false } ).filter( Boolean ) ] )
			.on( 'progress', progressCallback )
			.on( 'youtubeDlEvent', eventCallback )
			.on( 'error', ( err ) => {
				return reject( err )
			} )
			.on( 'close', () => {
				endCallback()
				resolve()
			} )
	} )
)

// based on https://github.com/microlinkhq/youtube-dl-exec/
const generateArguments = ( path, flags ) => {
	return [ path ].concat( strObjectToEmptyStr( dargs( convertEmptyStrToObj( flags ), { useEquals: false, allowCamelCase: true } ) ) )
}
export const atomicParsleyPromise =  ( path, options, execaOptions ) => execa( 'AtomicParsley', generateArguments( path, options ),  execaOptions ).stdout.pipe( process.stdout ) 
