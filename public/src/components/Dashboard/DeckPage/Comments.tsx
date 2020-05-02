import React, { memo } from 'react'

import Deck from '../../../models/Deck'
import Disqus from '../../shared/Disqus'

export default memo(({ deck }: { deck: Deck }) => (
	<>
		<div id="comments" />
		<Disqus {...deck.disqusProps} />
	</>
))
