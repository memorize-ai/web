import { NextApiHandler } from 'next'
import { create as xml } from 'xmlbuilder2'

import { DeckData } from 'models/Deck'
import getDecks from 'lib/getDecks'
import { BASE_URL } from 'lib/constants'

const deckToPath = (deck: DeckData) =>
	`/d/${deck.slugId}/${encodeURIComponent(deck.slug)}`

const getPaths = async () => [
	'',
	'/interests',
	'/market',
	'/new',
	'/privacy',
	'/support',
	...(await getDecks()).map(deckToPath)
]

const handler: NextApiHandler<string> = async (_req, res) => {
	try {
		res.setHeader('Access-Control-Allow-Origin', BASE_URL)
		
		const result = xml(
			{ version: '1.0', encoding: 'UTF-8' },
			{
				urlset: {
					'@xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
					'@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
					'@xsi:schemaLocation': 'http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd',
					url: (await getPaths()).map(path => ({ loc: `${BASE_URL}${path}` }))
				}
			}
		).end()
		
		res.setHeader('Content-Type', 'application/xml')
		res.send(result)
	} catch ({ message }) {
		res.status(500).send(message)
	}
}

export default handler
