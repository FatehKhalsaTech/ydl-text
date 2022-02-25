// from https://stackoverflow.com/questions/5582248/split-a-string-only-the-at-the-first-n-occurrences-of-a-delimiter


export const splitWithTail = ( str, delimiter, delimiterLimit ) => {
	const arr = str.split( delimiter ).filter( str => !!str )
	const	result = arr.splice( 0, delimiterLimit - 1 )
	result.push( arr.join( ' ' ) )
	return result
}
