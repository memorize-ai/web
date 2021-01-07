module.exports = require('next-optimized-images')({
	rewrites: () => [
		{ source: '/sitemap.xml', destination: '/api/sitemap' },
		{ source: '/_api/upload-deck-asset', destination: '/api/uploadDeckAsset' }
	],
	redirects: () => [
		{ source: '/d', destination: '/market', permanent: true }
	]
})
