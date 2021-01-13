import cx from 'classnames'

import PerformanceRating from 'models/PerformanceRating'
import RateButton from '../RateButton'

import styles from './index.module.scss'

export interface CramFooterProps {
	isWaitingForRating: boolean
	rate(rating: PerformanceRating): void
}

const CramFooter = ({ isWaitingForRating, rate }: CramFooterProps) => (
	<footer
		className={cx(styles.root, {
			[styles.waitingForRating]: isWaitingForRating
		})}
	>
		<p className={styles.message} tabIndex={-1}>
			Tap anywhere to continue
		</p>
		<div className={styles.buttons} tabIndex={-1}>
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
