import { useCallback, MouseEvent } from 'react'
import TimeAgo from 'javascript-time-ago'
import enLocale from 'javascript-time-ago/locale/en'
import cx from 'classnames'

import PerformanceRating from 'models/PerformanceRating'
import Loader from 'components/Loader'

import styles from './index.module.scss'

TimeAgo.addLocale(enLocale)
const timeAgo = new TimeAgo('en-US')

export interface ReviewRateButtonProps {
	emoji: string
	title: string
	subtitle: string
	rate(rating: PerformanceRating): void
	rating: PerformanceRating
	prediction: Date | null
}

const ReviewRateButton = ({
	emoji,
	title,
	subtitle,
	rate,
	rating,
	prediction
}: ReviewRateButtonProps) => {
	const predictionClassName = useCallback(
		(loading: boolean) =>
			cx(styles.prediction, styles[`rating_${rating}`], {
				[styles.loading]: loading
			}),
		[rating]
	)

	const onClick = useCallback(
		(event: MouseEvent) => {
			event.stopPropagation()
			rate(rating)
		},
		[rate, rating]
	)

	return (
		<button
			className={styles.root}
			onClick={onClick}
			aria-label={subtitle}
			data-balloon-pos="up"
		>
			<span className={styles.text}>
				<span className={styles.emoji}>{emoji}</span>
				<span className={styles.title}>{title}</span>
			</span>
			{prediction ? (
				<span className={predictionClassName(false)}>
					+{timeAgo.format(prediction, 'time')}
				</span>
			) : (
				<span className={predictionClassName(true)}>
					<Loader
						className={styles.loader}
						size="14px"
						thickness="3px"
						color="#4a4a4a"
					/>
				</span>
			)}
		</button>
	)
}

export default ReviewRateButton
