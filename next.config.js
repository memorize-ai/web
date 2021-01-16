/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

module.exports = require('next-optimized-images')({
	rewrites: () => [
		{ source: '/sitemap.xml', destination: '/api/sitemap' },
		{
			source: '/_api/upload-deck-asset',
			destination: '/api/uploadDeckAsset'
		},
		{
			source: '/_api/upload-user-asset',
			destination: '/api/uploadUserAsset'
		},
		{
			source: '/api/:method',
			destination:
				'https://us-central1-memorize-ai.cloudfunctions.net/api/:method'
		}
	],
	redirects: () => [{ source: '/d', destination: '/market', permanent: true }]
})
