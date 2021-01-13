import Link from 'next/link'

import Deck from 'models/Deck'
import Topic from 'models/Topic'

import styles from './index.module.scss'

export interface DeckPageFooterProps {
	deck: Deck
	topics: Topic[]
}

const DeckPageFooter = ({ deck, topics }: DeckPageFooterProps) => (
	<div id="description" className={styles.root}>
		<p className={styles.description}>{deck.description}</p>
		{topics.length > 0 && (
			<div className={styles.topics} {...Topic.schemaProps}>
				{topics.map((topic, i) => (
					<Link key={topic.id} href={topic.marketUrl}>
						<a
							{...topic.schemaProps}
							className={styles.topic}
							style={{ backgroundImage: topic.backgroundImage }}
						>
							<meta {...topic.positionSchemaProps(i)} />
							<meta {...topic.urlSchemaProps} />
							<img {...topic.imageSchemaProps} />
							<span {...topic.nameSchemaProps} className={styles.topicName}>
								{topic.name}
							</span>
						</a>
					</Link>
				))}
			</div>
		)}
	</div>
)

export default DeckPageFooter
