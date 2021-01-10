import TimeAgo from 'javascript-time-ago'
import enLocale from 'javascript-time-ago/locale/en'

import { ReviewProgressData, REVIEW_MASTERED_STREAK } from './useReviewState'
import Modal from 'components/Modal'

TimeAgo.addLocale(enLocale)
const timeAgo = new TimeAgo('en-US')

const ReviewProgressModal = ({
	data,
	isShowing,
	setIsShowing
}: {
	data: ReviewProgressData | null
	isShowing: boolean
	setIsShowing: (isShowing: boolean) => void
}) => {
	const isMastered = (data?.streak ?? 0) >= REVIEW_MASTERED_STREAK
	const didEarnXp = (data?.xp ?? 0) > 0

	return (
		<Modal
			className="review-progress"
			isShowing={isShowing}
			setIsShowing={setIsShowing}
		>
			<div className="badges">
				{data && didEarnXp && <p className="badge xp">+{data.xp} xp</p>}
				<p className="badge streak">
					{data?.streak} / {REVIEW_MASTERED_STREAK} streak
				</p>
			</div>
			<p className="emoji">{isMastered ? '🥳' : data?.emoji}</p>
			<p className="message">{isMastered ? 'Mastered!' : data?.message}</p>
			{data?.next && (
				<p className={`next rating-${data.rating}`}>
					+{timeAgo.format(data.next, 'time')}
				</p>
			)}
		</Modal>
	)
}

export default ReviewProgressModal
