import React, { memo, useCallback } from 'react'

import PerformanceRating from '../../../models/PerformanceRating'

const CramRateButton = (
	{ emoji, title, rate, rating }: {
		emoji: string
		title: string
		rate: (rating: PerformanceRating) => void
		rating: PerformanceRating
	}
) => {
	const onClick = useCallback(() => {
		rate(rating)
	}, [rate, rating])
	
	return (
		<button onClick={onClick}>
			<p className="emoji">{emoji}</p>
			<p className="title">{title}</p>
		</button>
	)
}

export default memo(CramRateButton)
