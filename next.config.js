module.exports = require('next-optimized-images')({
	rewrites: () => [
		{ source: '/sitemap.xml', destination: '/api/sitemap' }
	],
	redirects: () => [
		{ source: '/d', destination: '/market', permanent: true }
	]
})
