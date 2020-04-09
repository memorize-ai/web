import React from 'react'
import moment from 'moment'
import TimeAgo from 'javascript-time-ago'
import enLocale from 'javascript-time-ago/locale/en'

import Deck from '../../../models/Deck'
import Control from './Control'
import { formatNumber } from '../../../utils'

TimeAgo.addLocale(enLocale)

const timeAgo = new TimeAgo('en-US')

export default ({ deck, hasDeck }: { deck: Deck, hasDeck: boolean }) => (
	<div className="controls">
		<Control title="Ratings" className="ratings">
			
		</Control>
		<Control title="Info" className="info">
			<div>
				<p>Active users</p>
				<p>{formatNumber(deck.numberOfCurrentUsers)}</p>
			</div>
			<div>
				<p>All-time users</p>
				<p>{formatNumber(deck.numberOfAllTimeUsers)}</p>
			</div>
			<div>
				<p>Favorites</p>
				<p>{formatNumber(deck.numberOfFavorites)}</p>
			</div>
			<div>
				<p>Last updated</p>
				<p>{timeAgo.format(deck.lastUpdated)}</p>
			</div>
			<div>
				<p>Date created</p>
				<p>{moment(deck.created).format('MMM D, YYYY')}</p>
			</div>
		</Control>
	</div>
)
