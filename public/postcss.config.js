module.exports = {
	parser: 'postcss-scss',
	plugins: [
		require('postcss-import'),
		require('tailwindcss'),
		require('postcss-nested'),
		require('autoprefixer'),
		require('cssnano')({ preset: 'default' })
	]
}
