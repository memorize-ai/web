import React, { useMemo } from 'react'

import Deck from '../../../models/Deck'
import Disqus from '../../shared/Disqus'

export default ({ deck }: { deck: Deck }) =>
	useMemo(() => (
		<>
			<div id="comments" />
			<Disqus {...deck.disqusProps} />
		</>
	), [deck])
