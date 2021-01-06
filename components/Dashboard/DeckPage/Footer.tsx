import Link from 'next/link'

import Deck from 'models/Deck'
import Topic from 'models/Topic'

export interface DeckPageFooterProps {
	deck: Deck
	topics: Topic[]
}

const DeckPageFooter = ({ deck, topics }: DeckPageFooterProps) => (
	<div id="description" className="footer">
		<p className="description">
			{deck.description}
		</p>
		{topics.length > 0 && (
			<div className="topics" {...Topic.schemaProps}>
				{topics.map((topic, i) => (
					<Link key={topic.id} href={topic.marketUrl}>
						<a
							{...topic.schemaProps}
							style={{ backgroundImage: `url('${topic.imageUrl}')` }}
						>
							<meta {...topic.positionSchemaProps(i)} />
							<meta {...topic.urlSchemaProps} />
							<img {...topic.imageSchemaProps} />
							<p {...topic.nameSchemaProps}>{topic.name}</p>
						</a>
					</Link>
				))}
			</div>
		)}
	</div>
)

export default DeckPageFooter
