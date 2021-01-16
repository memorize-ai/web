import { NextApiHandler } from 'next'
import { create as xml } from 'xmlbuilder2'

import { UserData } from 'models/User'
import { DeckData } from 'models/Deck'
import getUsers from 'lib/getUsers'
import getDecks from 'lib/getDecks'
import { BASE_URL } from 'lib/constants'

const userToPath = ({ slugId, slug }: UserData) =>
	slugId && slug ? `/u/${slugId}/${slug}` : null

const getUserPaths = async () =>
	(await getUsers()).reduce((paths: string[], user) => {
		const path = userToPath(user)
		if (path) paths.push(path)

		return paths
	}, [])

const deckToPath = (deck: DeckData) =>
	`/d/${deck.slugId}/${encodeURIComponent(deck.slug)}`

const getDeckPaths = async () => (await getDecks()).map(deckToPath)

const getPaths = async () => [
	'',
	'/interests',
	'/market',
	'/new',
	'/privacy',
	'/support',
	...(await getUserPaths()),
	...(await getDeckPaths())
]

const handler: NextApiHandler<string> = async ({ method }, res) => {
	try {
		res.setHeader('Access-Control-Allow-Origin', BASE_URL)

		if (method !== 'GET') return res.status(400).send('Invalid method')

		const result = xml(
			{ version: '1.0', encoding: 'UTF-8' },
			{
				urlset: {
					'@xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
					'@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
					'@xsi:schemaLocation':
						'http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd',
					url: (await getPaths()).map(path => ({
						loc: `${BASE_URL}${path}`
					}))
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
