import { NextApiHandler } from 'next'

import { PrintError } from './models'
import getDeckBySlugId from 'lib/getDeckBySlugId'
import getContext from './getContext'
import getData from './getData'

interface Query {
	slugId: string
	slug: string
	sectionId?: string
}

const handler: NextApiHandler<Buffer | string> = async (
	{ method, query },
	res
) => {
	try {
		res.setHeader('Access-Control-Allow-Origin', '*')

		if (method !== 'GET') throw new PrintError(400, 'Invalid method')

		const { slugId, slug, sectionId } = (query as unknown) as Query
		const deck = await getDeckBySlugId(slugId)

		if (!deck) throw new PrintError(404, 'Deck not found')

		if (deck.slug !== slug) {
			res.redirect(
				301,
				`/print/${deck.slugId}/${encodeURIComponent(deck.slug)}${
					sectionId ? `/s/${sectionId}` : ''
				}`
			)
			return
		}

		const data = await getData(await getContext(deck, sectionId))

		res.setHeader('Content-Type', 'application/pdf')
		res.send(data)
	} catch ({ code, message }) {
		res.status(typeof code === 'number' ? code : 500).send(message)
	}
}

export default handler
