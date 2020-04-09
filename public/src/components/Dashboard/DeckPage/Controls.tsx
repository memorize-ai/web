import React from 'react'
import moment from 'moment'

import Deck from '../../../models/Deck'
import Control from './Control'

export default ({ deck, hasDeck }: { deck: Deck, hasDeck: boolean }) => (
	<div className="controls">
		<Control title="Ratings" className="ratings">
			
		</Control>
		<Control title="Info" className="info">
			<div>
				<p>Active users</p>
				<p>{deck.numberOfCurrentUsers}</p>
			</div>
			<div>
				<p>All-time users</p>
				<p>{deck.numberOfAllTimeUsers}</p>
			</div>
			<div>
				<p>Favorites</p>
				<p>{deck.numberOfFavorites}</p>
			</div>
			<div>
				<p>Last updated</p>
				<p>{moment(deck.lastUpdated).format('M d, YYYY')}</p>
			</div>
			<div>
				<p>Date created</p>
				{/* <p>{deck.created}</p> */}
			</div>
		</Control>
	</div>
)
