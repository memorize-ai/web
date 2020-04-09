import React from 'react'

import Deck from '../../../models/Deck'
import useTopics from '../../../hooks/useTopics'

export default ({ deck }: { deck: Deck }) => {
	const topics = useTopics().filter(topic =>
		deck.topics.includes(topic.id)
	)
	
	return (
		<div className="footer">
			<p className="description">
				{deck.description}
			</p>
			<div className="topics">
				{topics.map(topic => (
					<div
						key={topic.id}
						style={{
							backgroundImage: `linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.8)), url('${topic.imageUrl}')`
						}}
					>
						<p>{topic.name}</p>
					</div>
				))}
			</div>
		</div>
	)
}
