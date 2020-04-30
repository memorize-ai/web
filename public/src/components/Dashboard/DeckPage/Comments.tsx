import React, { useMemo } from 'react'

import Deck from '../../../models/Deck'
import Disqus, { DisqusCommentCount } from '../../shared/Disqus'

export default ({ deck }: { deck: Deck }) =>
	useMemo(() => {
		const { disqusProps } = deck
		
		return (
			<div id="comments" className="comments">
				<h2 className="title">
					Comments <span>(<DisqusCommentCount {...disqusProps} />)</span>
				</h2>
				<Disqus {...disqusProps} />
			</div>
		)
	}, [deck])
