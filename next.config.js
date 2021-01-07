module.exports = require('next-optimized-images')({
	rewrites: () => [
		{ source: '/sitemap.xml', destination: '/api/sitemap' },
		{ source: '/_api/upload-deck-asset', destination: '/api/uploadDeckAsset' },
		{ source: '/print/:slugId/:slug', destination: '/api/print/:slugId/:slug' },
		{ source: '/print/:slugId/:slug/s/:sectionId', destination: '/api/print/:slugId/:slug/:sectionId' }
	],
	redirects: () => [
		{ source: '/d', destination: '/market', permanent: true }
	]
})
