import cx from 'classnames'

import PerformanceRating from 'models/PerformanceRating'
import { PreviewPredictions } from 'hooks/usePreview'
import RateButton from '../RateButton'
import ClaimXPButton from '../ClaimXPButton'

import styles from './index.module.scss'

const RATINGS = [
	PerformanceRating.Easy,
	PerformanceRating.Struggled,
	PerformanceRating.Forgot
]

const BUTTON_CONTENT = {
	[PerformanceRating.Easy]: {
		emoji: '😀',
		title: 'Easy',
		subtitle: 'Without much effort, you were able to remember',
		tooltipPosition: 'up-left'
	},
	[PerformanceRating.Struggled]: {
		emoji: '😕',
		title: 'Struggled',
		subtitle: 'You struggled to remember, but eventually succeeded',
		tooltipPosition: 'up'
	},
	[PerformanceRating.Forgot]: {
		emoji: '😓',
		title: 'Forgot',
		subtitle: "You tried but couldn't remember",
		tooltipPosition: 'up-right'
	}
}

export interface PreviewFooterProps {
	isFinished: boolean
	isWaitingForRating: boolean
	predictions: PreviewPredictions | null
	rate(rating: PerformanceRating): void
}

const PreviewFooter = ({
	isFinished,
	isWaitingForRating,
	predictions,
	rate
}: PreviewFooterProps) => (
	<div
		className={cx(styles.root, {
			[styles.finished]: isFinished,
			[styles.waitingForRating]: isWaitingForRating
		})}
	>
		<ClaimXPButton className={styles.claim} inverted />
		<p className={styles.message} tabIndex={-1}>
			Try to recall, then flip
		</p>
		<div className={styles.buttons} tabIndex={-1}>
			{RATINGS.map(rating => (
				<RateButton
					{...BUTTON_CONTENT[rating]}
					key={rating}
					rate={rate}
					rating={rating}
					prediction={predictions && predictions[rating]}
				/>
			))}
		</div>
	</div>
)

export default PreviewFooter
