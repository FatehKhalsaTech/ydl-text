// from https://stackoverflow.com/questions/5582248/split-a-string-only-the-at-the-first-n-occurrences-of-a-delimiter


export const splitWithTail = ( str, delimiter, delimiterLimit ) => {
	const arr = str.split( delimiter ).filter( str => !!str )
	const	result = arr.splice( 0, delimiterLimit - 1 )
	result.push( arr.join( ' ' ) )
	return result
}


// reasoning: AtomicParsley supports empty strings to erase metadata, but dargs don't like that (they'll get filtered out). But String Objects return true, so we can just temporarily convert empty strings into new String objects.
export const convertEmptyStrToObj = ( obj ) => {
	const target = {}
	Object.entries( obj ).forEach( ( [ key, value ] ) => {
		if( value==='' ) target[ key ] = '\n\"\\'
		else target[ key ] = value
	} )
	return target
}

// dargs retruns an array, so we do so here as well
export const strObjectToEmptyStr = ( arr ) => {
	const target = []
	arr.forEach( ( value ) => {
		if ( value === '\n\"\\' ) target.push( '' )
		else target.push( value )
	} )
	return target
}
