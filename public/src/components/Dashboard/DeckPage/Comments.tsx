import React, { useMemo } from 'react'

import Deck from '../../../models/Deck'
import Disqus from '../../shared/Disqus'

export default ({ deck }: { deck: Deck }) =>
	useMemo(() => (
		<Disqus {...deck.disqusProps} />
	), [deck])
