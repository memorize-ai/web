import Deck from 'models/Deck'
import DiscussionEmbed from 'components/Disqus/DiscussionEmbed'

import styles from './index.module.scss'

export interface DeckPageCommentsProps {
	deck: Deck
}

const DeckPageComments = ({ deck }: DeckPageCommentsProps) => (
	<div id="comments" className={styles.root}>
		<DiscussionEmbed {...deck.disqusProps} />
	</div>
)

export default DeckPageComments
