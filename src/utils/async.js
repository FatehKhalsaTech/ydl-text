import { ydlError } from './error.js'

// Explanation: When we read the Youtube-DL events, it doesn't differentiate which video, so then multiple bars at the same time have the same name
export const executeSequentially = async ( iterable ) => {
	for ( const download of iterable ) {
		await download().catch( ydlError )
	}
}

export const awaitAll = ( promiseFactory, endCallback, errorCallback ) => {
	Promise.all( promiseFactory ).then( endCallback ).catch( errorCallback ) 
}
