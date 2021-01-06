import { memo } from 'react'

import Deck from 'models/Deck'
import DiscussionEmbed from 'components/Disqus/DiscussionEmbed'

const DeckPageComments = ({ deck }: { deck: Deck }) => (
	<>
		<div id="comments" />
		<DiscussionEmbed {...deck.disqusProps} />
	</>
)

export default memo(DeckPageComments)
