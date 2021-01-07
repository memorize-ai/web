import { useCallback, MouseEvent } from 'react'
import TimeAgo from 'javascript-time-ago'
import enLocale from 'javascript-time-ago/locale/en'
import cx from 'classnames'

import PerformanceRating from 'models/PerformanceRating'

TimeAgo.addLocale(enLocale)
const timeAgo = new TimeAgo('en-US')

const PreviewRateButton = ({
	emoji,
	title,
	subtitle,
	rate,
	rating,
	prediction,
	tooltipPosition
}: {
	emoji: string
	title: string
	subtitle: string
	rate: (rating: PerformanceRating) => void
	rating: PerformanceRating
	prediction: Date | null
	tooltipPosition: string
}) => {
	const onClick = useCallback(
		(event: MouseEvent) => {
			event.stopPropagation()
			rate(rating)
		},
		[rate, rating]
	)

	return (
		<button
			onClick={onClick}
			aria-label={subtitle}
			data-balloon-pos={tooltipPosition}
		>
			<span className="text">
				<span className="emoji">{emoji}</span>
				<span className="title">{title}</span>
			</span>
			<span className={cx('prediction', `rating-${rating}`)}>
				{prediction ? `+${timeAgo.format(prediction, 'time')}` : 'very soon'}
			</span>
		</button>
	)
}

export default PreviewRateButton
