import React, { memo, useCallback, MouseEvent } from 'react'
import TimeAgo from 'javascript-time-ago'
import enLocale from 'javascript-time-ago/locale/en'
import cx from 'classnames'

import PerformanceRating from '../../../models/PerformanceRating'

TimeAgo.addLocale(enLocale)

const timeAgo = new TimeAgo('en-US')

const PreviewRateButton = (
	{ emoji, title, subtitle, rate, rating, prediction }: {
		emoji: string
		title: string
		subtitle: string
		rate: (rating: PerformanceRating) => void
		rating: PerformanceRating
		prediction: Date | null
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
			data-balloon-pos="up"
		>
			<div className="text">
				<p className="emoji">{emoji}</p>
				<p className="title">{title}</p>
			</div>
			{prediction && (
				<p className={cx('prediction', `rating-${rating}`)}>
					+{timeAgo.format(prediction, 'time')}
				</p>
			)}
		</button>
	)
}

export default memo(PreviewRateButton)
