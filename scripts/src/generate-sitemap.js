const { writeFileSync } = require('fs')
const { join } = require('path')
const { create } = require('xmlbuilder2')

const { firestore } = require('../utils/firebase-admin')

if (require.main === module)
	(async () => {
		const urls = {
			'': { type: 'max' },
			'/landing': { type: 'max' },
			'/market': { type: 'high' }
		}
		
		for (const deck of (await firestore.collection('decks').get()).docs)
			urls[`/d/${deck.get('slugId')}/${deck.get('slug')}`] = {
				type: 'max',
				lastmod: deck.get('updated').toDate().toISOString()
			}
		
		writeFileSync(join(__dirname, '../../public/public/sitemap.xml'), create(
			{ version: '1.0', encoding: 'UTF-8' },
			{
				urlset: {
					'@xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
					'@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
					'@xsi:schemaLocation': 'http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd',
					url: Object.entries(urls).map(([path, { type, ...data }]) => {
						const loc = `https://memorize.ai${
							path
								.replace(/&/g, '&amp;')
								.replace(/'/g, '&apos;')
								.replace(/"/g, '&quot;')
								.replace(/>/g, '&gt;')
								.replace(/</g, '&lt;')
						}`
						
						switch (type) {
							case 'low':
								return { loc, priority: 0.2, ...data }
							case 'base':
								return { loc, ...data }
							case 'high':
								return { loc, priority: 0.8, ...data }
							case 'max':
								return { loc, priority: 1, ...data }
						}
					})
				}
			}
		).end())
	})()
