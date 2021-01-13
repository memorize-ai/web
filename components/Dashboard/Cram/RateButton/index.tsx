import { useCallback, MouseEvent } from 'react'

import PerformanceRating from 'models/PerformanceRating'

import styles from './index.module.scss'

export interface CramRateButtonProps {
	emoji: string
	title: string
	subtitle: string
	rate(rating: PerformanceRating): void
	rating: PerformanceRating
}

const CramRateButton = ({
	emoji,
	title,
	subtitle,
	rate,
	rating
}: CramRateButtonProps) => {
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
			<span className={styles.emoji}>{emoji}</span>
			<span className={styles.title}>{title}</span>
		</button>
	)
}

export default CramRateButton
