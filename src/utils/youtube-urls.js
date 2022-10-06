// from SO: https://stackoverflow.com/a/8260383/10368648

export const getYoutubeVideoID = ( url ) => {
	const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
	const match = url.match( regExp )
	return ( match&&match[ 7 ].length==11 )? match[ 7 ] : false
}