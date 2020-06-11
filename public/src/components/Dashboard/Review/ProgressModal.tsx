import React, { memo } from 'react'

import { ReviewProgressData, REVIEW_MASTERED_STREAK } from './useReviewState'
import Modal from '../../shared/Modal'

const ReviewProgressModal = (
	{ data, isShowing, setIsShowing }: {
		data: ReviewProgressData | null
		isShowing: boolean
		setIsShowing: (isShowing: boolean) => void
	}
) => {
	const isMastered = (data?.streak ?? 0) >= REVIEW_MASTERED_STREAK
	const didEarnXp = (data?.xp ?? 0) > 0
	
	return (
		<Modal
			className="review-progress"
			isLazy={false}
			isShowing={isShowing}
			setIsShowing={setIsShowing}
		>
			<div className="badges">
				{didEarnXp && (
					<p className="badge xp">+{data!.xp} xp</p>
				)}
				<p className="badge streak">
					{data?.streak} / {REVIEW_MASTERED_STREAK} streak
				</p>
			</div>
			<p className="emoji">
				{isMastered
					? '🥳'
					: data?.emoji
				}
			</p>
			<p className="message">
				{isMastered
					? 'Mastered!'
					: data?.message
				}
			</p>
		</Modal>
	)
}

export default memo(ReviewProgressModal)
