const compose = require('next-compose')

module.exports = compose([
	[require('next-images')],
	[require('@next/mdx')()]
])
