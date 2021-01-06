import { useCallback, MouseEvent } from 'react'
import TimeAgo from 'javascript-time-ago'
import enLocale from 'javascript-time-ago/locale/en'
import cx from 'classnames'

import PerformanceRating from 'models/PerformanceRating'
import Loader from 'components/Loader'

TimeAgo.addLocale(enLocale)
const timeAgo = new TimeAgo('en-US')

const ReviewRateButton = (
	{ emoji, title, subtitle, rate, rating, prediction }: {
		emoji: string
		title: string
		subtitle: string
		rate: (rating: PerformanceRating) => void
		rating: PerformanceRating
		prediction: Date | null
	}
) => {
	const predictionClassName = useCallback((loading: boolean) => (
		cx('prediction', `rating-${rating}`, { loading })
	), [rating])
	
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
			{prediction
				? (
					<p className={predictionClassName(false)}>
						+{timeAgo.format(prediction, 'time')}
					</p>
				)
				: (
					<div className={predictionClassName(true)}>
						<Loader size="14px" thickness="3px" color="#4a4a4a" />
					</div>
				)
			}
		</button>
	)
}

export default ReviewRateButton
