import { useCallback, MouseEvent } from 'react'
import TimeAgo from 'javascript-time-ago'
import enLocale from 'javascript-time-ago/locale/en'
import cx from 'classnames'

import PerformanceRating from 'models/PerformanceRating'

import styles from './index.module.scss'

TimeAgo.addLocale(enLocale)
const timeAgo = new TimeAgo('en-US')

export interface PreviewRateButtonProps {
	emoji: string
	title: string
	subtitle: string
	rate(rating: PerformanceRating): void
	rating: PerformanceRating
	prediction: Date | null
	tooltipPosition: string
}

const PreviewRateButton = ({
	emoji,
	title,
	subtitle,
	rate,
	rating,
	prediction,
	tooltipPosition
}: PreviewRateButtonProps) => {
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
			data-balloon-pos={tooltipPosition}
		>
			<span className={styles.text}>
				<span className={styles.emoji} role="img">
					{emoji}
				</span>
				<span className={styles.title}>{title}</span>
			</span>
			<span className={cx(styles.prediction, styles[`rating_${rating}`])}>
				{prediction ? `+${timeAgo.format(prediction, 'time')}` : 'very soon'}
			</span>
		</button>
	)
}

export default PreviewRateButton
