module.exports = require('next-compose-plugins')([
	[require('next-optimized-images')],
	[require('@next/mdx')()],
	[require('next-pwa'), {
		pwa: {
			disable: process.env.NODE_ENV === 'development',
			dest: 'public',
			runtimeCaching: require('next-pwa/cache')
		}
	}]
])
