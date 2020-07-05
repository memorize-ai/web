import React, { memo, useCallback, MouseEvent } from 'react'
import TimeAgo from 'javascript-time-ago'
import enLocale from 'javascript-time-ago/locale/en'
import cx from 'classnames'

import PerformanceRating from '../../../models/PerformanceRating'

TimeAgo.addLocale(enLocale)

const timeAgo = new TimeAgo('en-US')

const PreviewRateButton = (
	{ emoji, title, subtitle, rate, rating, prediction, tooltipPosition }: {
		emoji: string
		title: string
		subtitle: string
		rate: (rating: PerformanceRating) => void
		rating: PerformanceRating
		prediction: Date | null
		tooltipPosition: string
	}
) => {
	const onClick = useCallback((event: MouseEvent) => {
		event.stopPropagation()
		rate(rating)
	}, [rate, rating])
	
	return (
		<button
			onClick={onClick}
			aria-label={subtitle}
			data-balloon-pos={tooltipPosition}
		>
			<div className="text">
				<p className="emoji">{emoji}</p>
				<p className="title">{title}</p>
			</div>
			<p className={cx('prediction', `rating-${rating}`)}>
				{prediction
					? `+${timeAgo.format(prediction, 'time')}`
					: 'very soon'
				}
			</p>
		</button>
	)
}

export default memo(PreviewRateButton)
