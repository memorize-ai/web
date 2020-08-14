const compose = require('next-compose-plugins')

module.exports = compose([
	[require('next-images')],
	[require('@next/mdx')()],
	[require('next-pwa'), {
		pwa: {
			disable: process.env.NODE_ENV === 'development',
			dest: 'public',
			runtimeCaching: require('next-pwa/cache')
		}
	}]
])
