module.exports = require('next-optimized-images')({
	redirects: () => [
		{ source: '/d', destination: '/market', permanent: true }
	]
})
