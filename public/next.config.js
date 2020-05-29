module.exports = require('next-compose-plugins')([
	[require('next-pwa'), {
		pwa: {
			dest: 'public'
		}
	}],
	require('next-optimized-images')
])
