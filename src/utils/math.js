export const round = ( number ) => Math.trunc( number * 1000 ) / 1000

export const rand = ( min = 0, max = 1000 ) => Math.floor( Math.random() * ( max + 1 - min ) + min )
