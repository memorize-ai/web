import React from 'react'
import Link from 'next/link'

import Deck from 'models/Deck'
import Topic from 'models/Topic'
import useTopics from 'hooks/useTopics'

export default ({ deck }: { deck: Deck }) => {
	const topics = useTopics()?.filter(topic =>
		deck.topics.includes(topic.id)
	)
	
	return (
		<div id="description" className="footer">
			<p className="description">
				{deck.description}
			</p>
			<div className="topics" {...Topic.schemaProps}>
				{topics?.map((topic, i) => (
					<Link key={topic.id} href={topic.marketUrl}>
						<a
							style={{
								backgroundImage: `url('${topic.imageUrl}')`
							}}
							{...topic.schemaProps}
						>
							<meta {...topic.positionSchemaProps(i)} />
							<meta {...topic.urlSchemaProps} />
							<img {...topic.imageSchemaProps} /* eslint-disable-line */ />
							<p {...topic.nameSchemaProps}>{topic.name}</p>
						</a>
					</Link>
				))}
			</div>
		</div>
	)
}
