import React from 'react'
import { Link } from 'react-router-dom'

import Deck from '../../../models/Deck'
import useTopics from '../../../hooks/useTopics'
import Topic from '../../../models/Topic'

const DeckPageFooter = ({ deck }: { deck: Deck }) => {
	const topics = (useTopics() ?? [])
		.filter(topic => deck.topics.includes(topic.id))
	
	return (
		<div id="description" className="footer">
			<p className="description">
				{deck.description}
			</p>
			{topics.length > 0 && (
				<div className="topics" {...Topic.schemaProps}>
					{topics.map((topic, i) => (
						<Link
							key={topic.id}
							to={topic.marketUrl}
							style={{
								backgroundImage: `url('${topic.imageUrl}')`
							}}
							{...topic.schemaProps}
						>
							<meta {...topic.positionSchemaProps(i)} />
							<meta {...topic.urlSchemaProps} />
							<img {...topic.imageSchemaProps} /* eslint-disable-line */ />
							<p {...topic.nameSchemaProps}>{topic.name}</p>
						</Link>
					))}
				</div>
			)}
		</div>
	)
}

export default DeckPageFooter
