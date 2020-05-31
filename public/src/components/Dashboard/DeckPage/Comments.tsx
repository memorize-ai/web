import React, { memo } from 'react'

import Deck from '../../../models/Deck'
import Disqus from '../../shared/Disqus'

const DeckPageComments = memo(({ deck }: { deck: Deck }) => (
	<>
		<div id="comments" />
		<Disqus {...deck.disqusProps} />
	</>
))

export default DeckPageComments
