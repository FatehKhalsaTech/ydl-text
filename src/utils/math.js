export const round = ( number, decimalPlaces ) => Number( number.toFixed( decimalPlaces ) )

export const rand = ( min = 0, max = 1000 ) => Math.floor( Math.random() * ( max + 1 - min ) + min )

// supports HH:MM:SS, MM:SS, and SS
export const parseTimeToSeconds = ( timeString ) => {
	const sections = timeString.split( ':' )
	let scaleFactor =1, seconds = 0 
  
	sections.reverse().forEach( ( timeConstituent ) => {
		// parse the time part to an integer, and multiply by the scaleFactor (thus why it starts one, because seconds map 1 to 1)
		seconds += scaleFactor * parseInt( timeConstituent, 10 )

		// now we will be moving up the parts, so each time we increase by 60 timeConstituent
		scaleFactor *= 60
	} )

	return seconds
}
