import React, { memo } from 'react'
import cx from 'classnames'

import PerformanceRating from '../../../models/PerformanceRating'
import RateButton from './RateButton'

const CramFooter = (
	{ isWaitingForRating, rate }: {
		isWaitingForRating: boolean
		rate: (rating: PerformanceRating) => void
	}
) => (
	<footer className={cx({ 'waiting-for-rating': isWaitingForRating })}>
		<p className="message" tabIndex={-1}>
			Tap anywhere to continue
		</p>
		<div className="buttons" tabIndex={-1}>
			<RateButton
				emoji="😀"
				title="Easy"
				subtitle="Without much effort, you were able to remember"
				rate={rate}
				rating={PerformanceRating.Easy}
			/>
			<RateButton
				emoji="😕"
				title="Struggled"
				subtitle="You struggled to remember, but eventually succeeded"
				rate={rate}
				rating={PerformanceRating.Struggled}
			/>
			<RateButton
				emoji="😓"
				title="Forgot"
				subtitle="You tried but couldn't remember"
				rate={rate}
				rating={PerformanceRating.Forgot}
			/>
		</div>
	</footer>
)

export default CramFooter
