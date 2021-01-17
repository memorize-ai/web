/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const { getCSP, SELF, DATA, INLINE } = require('csp-header')

const IS_PRODUCTION = process.env.NODE_ENV === 'production'
const ORIGIN = IS_PRODUCTION ? 'https://memorize.ai' : 'http://localhost:3000'

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
const STORAGE_BUCKET = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET

if (!(PROJECT_ID && STORAGE_BUCKET))
	throw new Error('Missing Firebase credentials')

const STORAGE_BASE_URL = `https://firebasestorage.googleapis.com/v0/b/${STORAGE_BUCKET}/o/`

const SEARCH_HOST = 'host-fig55q'
const SEARCH_ENGINE_NAME = 'memorize-ai-decks'

const GOOGLE_ANALYTICS = [
	'https://www.googletagmanager.com',
	'https://www.google-analytics.com'
]

const plugins = [
	[require('next-optimized-images')],
	[require('@next/bundle-analyzer')({ enabled: process.env.ANALYZE === '1' })]
]

const config = {
	headers: () => [
		{
			source: '/(.*)',
			headers: [
				{ key: 'Access-Control-Allow-Origin', value: ORIGIN },
				{
					key: 'Content-Security-Policy',
					value: getCSP({
						directives: {
							'default-src': [
								SELF,
								'https://disqus.com',
								'https://c.disquscdn.com'
							],
							'base-uri': SELF,
							'font-src': [SELF, 'https://fonts.gstatic.com'],
							'frame-src': [
								SELF,
								`https://${PROJECT_ID}.firebaseapp.com`,
								'https://disqus.com',
								'https://app.hubspot.com'
							],
							'frame-ancestors': [SELF],
							'img-src': [
								SELF,
								DATA,
								...GOOGLE_ANALYTICS,
								STORAGE_BASE_URL,
								'https://links.services.disqus.com',
								'https://referrer.disqus.com',
								'https://c.disquscdn.com',
								'https://cdn.viglink.com',
								'https://forms.hsforms.com',
								'https://track.hubspot.com'
							],
							'media-src': [SELF, DATA, STORAGE_BASE_URL],
							'script-src': [
								SELF,
								...(IS_PRODUCTION ? [] : ["'unsafe-eval'"]),
								...GOOGLE_ANALYTICS,
								'https://apis.google.com',
								'https://memorize-ai.disqus.com',
								'https://c.disquscdn.com',
								'https://js.hs-scripts.com',
								'https://js.hs-analytics.net',
								'https://js.hs-banner.com',
								'https://js.usemessages.com',
								'https://js.hscollectedforms.net',
								"'sha256-Nqnn8clbgv+5l0PgxcTOldg8mkMKrFn4TvPL+rYUUGg='" // Empty script
							],
							'style-src': [
								SELF,
								INLINE,
								'https://fonts.googleapis.com',
								'https://c.disquscdn.com'
							],
							'connect-src': [
								SELF,
								...GOOGLE_ANALYTICS,
								'https://*.googleapis.com',
								`https://${SEARCH_HOST}.api.swiftype.com/api/as/v1/engines/${SEARCH_ENGINE_NAME}/search.json`,
								'https://links.services.disqus.com',
								'https://api.hubspot.com',
								'https://forms.hubspot.com'
							],
							'block-all-mixed-content': true,
							'upgrade-insecure-requests': true
						}
					})
				},
				{ key: 'Expect-CT', value: '0' },
				{ key: 'Referrer-Policy', value: 'no-referrer' },
				{ key: 'Strict-Transport-Security', value: 'max-age=15552000' },
				{ key: 'X-Content-Type-Options', value: 'nosniff' },
				{ key: 'X-DNS-Prefetch-Control', value: 'off' },
				{ key: 'X-Download-Options', value: 'noopen' },
				{ key: 'X-Frame-Options', value: 'SAMEORIGIN' },
				{ key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
				{ key: 'X-XSS-Protection', value: '0' }
			]
		}
	],
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
			destination: `https://us-central1-${PROJECT_ID}.cloudfunctions.net/api/:method`
		}
	],
	redirects: () => [{ source: '/d', destination: '/market', permanent: true }]
}

module.exports = require('next-compose-plugins')(plugins, config)
