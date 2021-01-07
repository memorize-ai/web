module.exports = require('next-optimized-images')({
	rewrites: () => [
		{ source: '/sitemap.xml', destination: '/api/sitemap' },
		{ source: '/_api/upload-deck-asset', destination: '/api/uploadDeckAsset' },
		{ source: '/print/:slugId/:slug', destination: '/api/print/:slugId/:slug' },
		{ source: '/print/:slugId/:slug/s/:sectionId', destination: '/api/print/:slugId/:slug/:sectionId' },
		{ source: '/api/:method', destination: 'https://us-central1-memorize-ai.cloudfunctions.net/api/:method' }
	],
	redirects: () => [
		{ source: '/d', destination: '/market', permanent: true }
	]
})
