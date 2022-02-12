/* eslint-disable no-undef */
module.exports = {
	'env': {
		'browser': true,
		'es2021': true
	},
	'extends': 'eslint:recommended',
	'parserOptions': {
		'ecmaVersion': 'latest',
		'sourceType': 'module'
	},
	'rules': {
		'indent': [
			'error',
			'tab'
		],
		'linebreak-style': [
			'error',
			'unix'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'never'
		],
		'array-bracket-spacing': [
			'error',
			'always'
		],
		'computed-property-spacing': [
			'error',
			'always'
		],
		'import/no-unresolved': 0,
		'object-curly-spacing': [
			'error',
			'always'
		],
		'object-curly-newline': [
			'error',
			{
				'consistent': true
			}
		],
		'object-property-newline': [
			'error',
			{
				'allowAllPropertiesOnSameLine': true
			}
		],
		'space-in-parens': [
			'error',
			'always',
			{
				'exceptions': [
					'empty'
				]
			}
		],
	}
}
