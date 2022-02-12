import cliProgress from 'cli-progress'

export const createMulitProgressBar = () => (
	new cliProgress.MultiBar(
		{ hideCursor: true },
		cliProgress.Presets.shades_classic,
	)
)
export const createSingleProgressBar = () => (
	new cliProgress.SingleBar( { hideCursor: true }, cliProgress.Presets.shades_classic )
)