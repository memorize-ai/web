import React from 'react'
import { Link } from 'react-router-dom'

import Deck from '../../../models/Deck'
import { DeckSortAlgorithm } from '../../../models/Deck/Search'
import useTopics from '../../../hooks/useTopics'
import { urlWithQuery } from '../../../utils'

export default ({ deck }: { deck: Deck }) => {
	const topics = useTopics().filter(topic =>
		deck.topics.includes(topic.id)
	)
	
	return (
		<div id="description" className="footer">
			<p className="description">
				{deck.description}
			</p>
			<div className="topics">
				{topics.map(topic => (
					<Link
						key={topic.id}
						to={urlWithQuery('/market', {
							q: topic.name,
							s: DeckSortAlgorithm.Top
						})}
						style={{
							backgroundImage: `linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.8)), url('${topic.imageUrl}')`
						}}
					>
						<p>{topic.name}</p>
					</Link>
				))}
			</div>
		</div>
	)
}
