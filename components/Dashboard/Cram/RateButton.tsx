import { useCallback, MouseEvent } from 'react'

import PerformanceRating from 'models/PerformanceRating'

const CramRateButton = ({
	emoji,
	title,
	subtitle,
	rate,
	rating
}: {
	emoji: string
	title: string
	subtitle: string
	rate: (rating: PerformanceRating) => void
	rating: PerformanceRating
}) => {
	const onClick = useCallback(
		(event: MouseEvent) => {
			event.stopPropagation()
			rate(rating)
		},
		[rate, rating]
	)

	return (
		<button onClick={onClick} aria-label={subtitle} data-balloon-pos="up">
			<p className="emoji">{emoji}</p>
			<p className="title">{title}</p>
		</button>
	)
}

export default CramRateButton
