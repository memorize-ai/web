import { useState } from 'react'
import { Svg } from 'react-optimized-image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as faStarFilled } from '@fortawesome/free-solid-svg-icons'
import { faStar as faStarOutlined } from '@fortawesome/free-regular-svg-icons'
import TimeAgo from 'javascript-time-ago'
import enLocale from 'javascript-time-ago/locale/en'

import Deck from 'models/Deck'
import useCurrentUser from 'hooks/useCurrentUser'
import Stars from 'components/Stars'
import formatNumber from 'lib/formatNumber'
import formatDate from 'lib/formatDate'

import star from 'images/icons/gray-star.svg'
import styles from './index.module.scss'

const SLIDERS = [5, 4, 3, 2, 1] as const
const STARS = [1, 2, 3, 4, 5] as const

TimeAgo.addLocale(enLocale)
const timeAgo = new TimeAgo('en-US')

export interface DeckPageControlsProps {
	deck: Deck
	hasDeck: boolean
}

const DeckPageControls = ({ deck, hasDeck }: DeckPageControlsProps) => {
	const [currentUser] = useCurrentUser()
	const [hoverRating, setHoverRating] = useState(
		null as 1 | 2 | 3 | 4 | 5 | null
	)

	const uid = currentUser?.id
	const rating = deck.userData?.rating ?? 0

	return (
		<div className={styles.root}>
			<div id="ratings" className={styles.ratings}>
				<div className={styles.ratingInfo}>
					<div className={styles.ratingData}>
						<Stars>{deck.averageRating}</Stars>
						<div className={styles.ratingDataText}>
							<h3 className={styles.averageRating}>
								{deck.averageRating.toFixed(1)}
							</h3>
							<p className={styles.ratingCount}>
								<span className={styles.ratingCountText}>
									{formatNumber(deck.numberOfRatings)}
								</span>{' '}
								review{deck.numberOfRatings === 1 ? '' : 's'}
							</p>
						</div>
					</div>
					<table className={styles.ratingSliders}>
						<tbody>
							{SLIDERS.map(i => {
								const count = deck.countForRating(i)

								return (
									<tr key={i}>
										<td className={styles.ratingStar}>{i}</td>
										<td className={styles.ratingStarIcon}>
											<Svg src={star} />
										</td>
										<td className={styles.ratingSlider}>
											<div className={styles.ratingSliderContent}>
												<div
													className={styles.ratingSliderInnerContent}
													style={{
														width: `${
															(100 * count) / (deck.numberOfRatings || 1)
														}%`
													}}
												/>
											</div>
										</td>
										<td className={styles.ratingStarCount}>
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
						<div className={styles.ratingDivider} />
						<div className={styles.rate}>
							<p className={styles.rateMessage}>Click to rate</p>
							<div className={styles.rateStars}>
								{STARS.map(i => (
									<FontAwesomeIcon
										key={i}
										className={styles.rateStar}
										onClick={() =>
											uid && deck.rate(uid, rating === i ? null : i)
										}
										onMouseEnter={() => setHoverRating(i)}
										onMouseLeave={() => setHoverRating(null)}
										icon={
											(hoverRating ?? rating) >= i
												? faStarFilled
												: faStarOutlined
										}
									/>
								))}
							</div>
						</div>
					</>
				)}
			</div>
			<div id="info" className={styles.info}>
				<div className={styles.infoRow}>
					<p className={styles.infoKey}>Active users</p>
					<p className={styles.infoValue}>
						{formatNumber(deck.numberOfCurrentUsers)}
					</p>
				</div>
				<div className={styles.infoRow}>
					<p className={styles.infoKey}>All-time users</p>
					<p className={styles.infoValue}>
						{formatNumber(deck.numberOfAllTimeUsers)}
					</p>
				</div>
				<div className={styles.infoRow}>
					<p className={styles.infoKey}>Favorites</p>
					<p className={styles.infoValue}>
						{formatNumber(deck.numberOfFavorites)}
					</p>
				</div>
				<div className={styles.infoRow}>
					<p className={styles.infoKey}>Last updated</p>
					<p className={styles.infoValue}>{timeAgo.format(deck.lastUpdated)}</p>
				</div>
				<div className={styles.infoRow}>
					<p className={styles.infoKey}>Date created</p>
					<p className={styles.infoValue}>{formatDate(deck.created)}</p>
				</div>
			</div>
		</div>
	)
}

export default DeckPageControls
