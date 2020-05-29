import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as faStarFilled } from '@fortawesome/free-solid-svg-icons'
import { faStar as faStarOutlined } from '@fortawesome/free-regular-svg-icons'
import moment from 'moment'
import TimeAgo from 'javascript-time-ago'
import enLocale from 'javascript-time-ago/locale/en'

import Deck from 'models/Deck'
import useCurrentUser from 'hooks/useCurrentUser'
import Stars from 'components/shared/Stars'
import { formatNumber } from 'lib/utils'

import GrayStar from '../../../images/icons/gray-star.svg'

TimeAgo.addLocale(enLocale)

const timeAgo = new TimeAgo('en-US')

export default ({ deck, hasDeck }: { deck: Deck, hasDeck: boolean }) => {
	const [currentUser] = useCurrentUser()
	
	const [hoverRating, setHoverRating] = useState(null as 1 | 2 | 3 | 4 | 5 | null)
	
	const uid = currentUser?.id
	const rating = deck.userData?.rating ?? 0
	
	return (
		<div className="controls">
			<div id="ratings" className="ratings">
				<div className="top">
					<div className="left">
						<Stars>{deck.averageRating}</Stars>
						<div className="info">
							<h3 className="rating">
								{deck.averageRating.toFixed(1)}
							</h3>
							<p className="count">
								<span>{formatNumber(deck.numberOfRatings)} </span>
								review{deck.numberOfRatings === 1 ? '' : 's'}
							</p>
						</div>
					</div>
					<table className="sliders">
						<tbody>
							{([5, 4, 3, 2, 1] as const).map(i => {
								const count = deck.countForRating(i)
								
								return (
									<tr key={i}>
										<td className="star">{i}</td>
										<td className="icon">
											<GrayStar />
										</td>
										<td className="slider">
											<div>
												<div style={{
													width: `${100 * count / (deck.numberOfRatings || 1)}%`
												}} />
											</div>
										</td>
										<td className="count">
											{formatNumber(count)}
										</td>
									</tr>
								)
							})}
						</tbody>
					</table>
				</div>
				{uid && hasDeck && (
					<>
						<div className="divider" />
						<div className="bottom">
							<p className="rate-message">
								Click to rate
							</p>
							<div className="stars">
								{([1, 2, 3, 4, 5] as const).map(i => {
									const props = {
										key: i,
										onClick: () =>
											uid && deck.rate(
												uid,
												rating === i ? null : i
											),
										onMouseEnter: () =>
											setHoverRating(i),
										onMouseLeave: () =>
											setHoverRating(null)
									}
									
									return (
										<FontAwesomeIcon
											{...props}
											icon={
												(hoverRating ?? rating) >= i
													? faStarFilled
													: faStarOutlined
											}
										/>
									)
								})}
							</div>
						</div>
					</>
				)}
			</div>
			<div id="info" className="info">
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
			</div>
		</div>
	)
}
