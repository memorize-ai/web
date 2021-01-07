import { NextApiHandler } from 'next'

import getDeckBySlugId from 'lib/getDeckBySlugId'
import getContext from './getContext'
import getData from './getData'

interface Query {
	slugId: string
	slug: string
	sectionId?: string
}

const handler: NextApiHandler<Buffer | string> = async ({ method, query }, res) => {
	try {
		res.setHeader('Access-Control-Allow-Origin', '*')
		
		if (method !== 'GET')
			return res.status(400).send('Invalid method')
		
		const { slugId, slug, sectionId } = query as any as Query
		const deck = await getDeckBySlugId(slugId)
		
		if (deck.slug !== slug) {
			res.redirect(301, `/print/${deck.slugId}/${deck.slug}${sectionId ? `/s/${sectionId}` : ''}`)
			return
		}
		
		const data = await getData(await getContext(deck, sectionId))
		
		res.setHeader('Content-Type', 'application/pdf')
		res.send(data)
	} catch (error) {
		res.status(404).send('Not found')
	}
}

export default handler
