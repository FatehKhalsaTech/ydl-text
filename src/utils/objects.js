export const assignDefined = ( target, source ) => {
	Object.entries( source ).forEach( ( [ key, value ] ) => {
		if ( Array.isArray( value ) && !value.includes( undefined ) ) target[ key ] = value
		else if( value != undefined ) target[ key ] = value
	} )

	return target
}
