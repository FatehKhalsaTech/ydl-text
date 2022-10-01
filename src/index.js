#!/usr/bin/env node
import { Command } from 'commander'
const program = new Command()

program
	.version( '1.7.7' )
	.description( 'mass install music' )
	.command( 'download', 'install shabads with a text file', { executableFile: './commands/download.js' } ).alias( 'd' )
	.command( 'metadata', 'assign metadata to a file', { executableFile: './commands/metadata.js' } ).alias( 'm' )
	.command( 'thumbnail-crop', 'crop a thumbnail for audio', { executableFile: './commands/crop.js' } ).alias( 't' )
	.command( 'cut', 'cut a file with timestamps', { executableFile: './commands/cut.js' } ).alias( 'c' )
	.command( 'convert', 'either convert audio to m4a or img to jgp', { executableFile: './commands/convert.js' } ).alias( 'f' )
	.showHelpAfterError()

program.parse( process.argv )
