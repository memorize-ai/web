import TimeAgo from 'javascript-time-ago'
import enLocale from 'javascript-time-ago/locale/en'
import cx from 'classnames'

import { ReviewProgressData, REVIEW_MASTERED_STREAK } from '../useReviewState'
import Modal from 'components/Modal'

import styles from './index.module.scss'

TimeAgo.addLocale(enLocale)
const timeAgo = new TimeAgo('en-US')

export interface ReviewProgressModalProps {
	data: ReviewProgressData | null
	isShowing: boolean
	setIsShowing(isShowing: boolean): void
}

const ReviewProgressModal = ({
	data,
	isShowing,
	setIsShowing
}: ReviewProgressModalProps) => {
	const isMastered = (data?.streak ?? 0) >= REVIEW_MASTERED_STREAK
	const didEarnXp = (data?.xp ?? 0) > 0

	return (
		<Modal
			className={styles.root}
			isShowing={isShowing}
			setIsShowing={setIsShowing}
		>
			<div className={styles.badges}>
				{data && didEarnXp && <p className={styles.xp}>+{data.xp} xp</p>}
				<p className={styles.streak}>
					{data?.streak} / {REVIEW_MASTERED_STREAK} streak
				</p>
			</div>
			<p className={styles.emoji}>{isMastered ? '🥳' : data?.emoji}</p>
			<p className={styles.message}>
				{isMastered ? 'Mastered!' : data?.message}
			</p>
			{data?.next && (
				<p className={cx(styles.next, styles[`rating_${data.rating}`])}>
					+{timeAgo.format(data.next, 'time')}
				</p>
			)}
		</Modal>
	)
}

export default ReviewProgressModal
