import fs from 'fs'
import nodePath from 'path'

import { ydlError } from './error.js'
const readFile = ( path ) =>  fs.readFileSync( path ).toString().split( '\n' ).filter( ( str ) => str !== '' )

const validatePath = ( path ) => {
	const exists = fs.existsSync( path )
   
	if( !exists ) ydlError( 'Please enter a valid path!' )
}

const getFileExtension = ( path ) => {
	const ext = nodePath.extname( path )
	return ext.substring( 1, ext.length )
}

const getFileName = ( path ) => {
	const { ext } = getFileExtension( path )
	return nodePath.basename( path, ext )
}

export { readFile, validatePath, getFileName, getFileExtension }
