import React, { useCallback, MouseEvent } from 'react'
import TimeAgo from 'javascript-time-ago'
import enLocale from 'javascript-time-ago/locale/en'
import cx from 'classnames'

import PerformanceRating from '../../models/PerformanceRating'
import Loader from '../shared/Loader'

import styles from '../../scss/components/Inline/RateButton.module.scss'

TimeAgo.addLocale(enLocale)

const timeAgo = new TimeAgo('en-US')

const getBalloonPosition = (rating: PerformanceRating) => {
	switch (rating) {
		case PerformanceRating.Easy:
			return 'up-left'
		case PerformanceRating.Struggled:
			return 'up'
		case PerformanceRating.Forgot:
			return 'up-right'
	}
}

const InlineRateButton = (
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
		cx(styles.prediction, styles[`predictionRating_${rating}`], {
			[styles.predictionLoading]: loading
		})
	), [rating])
	
	const onClick = useCallback((event: MouseEvent) => {
		event.stopPropagation()
		rate(rating)
	}, [rate, rating])
	
	return (
		<button
			className={styles.root}
			onClick={onClick}
			aria-label={subtitle}
			data-balloon-pos={getBalloonPosition(rating)}
		>
			<div className={styles.text}>
				<span
					className={styles.emoji}
					role="img"
					aria-hidden="true"
				>
					{emoji}
				</span>
				<p className={styles.title}>{title}</p>
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

export default InlineRateButton
