import React, { memo } from 'react'
import TimeAgo from 'javascript-time-ago'
import enLocale from 'javascript-time-ago/locale/en'

import { PreviewProgressData } from './usePreview'
import Modal from '../../shared/Modal'

TimeAgo.addLocale(enLocale)

const timeAgo = new TimeAgo('en-US')

const PreviewProgressModal = (
	{ data, isShowing, setIsShowing }: {
		data: PreviewProgressData | null
		isShowing: boolean
		setIsShowing: (isShowing: boolean) => void
	}
) => (
	<Modal
		className="preview-progress"
		isLazy={false}
		isShowing={isShowing}
		setIsShowing={setIsShowing}
	>
		<p className="emoji">
			{data?.emoji}
		</p>
		<p className="message">
			{data?.message}
		</p>
		{data && (
			<p className={`next rating-${data.rating}`}>
				{data.next
					? `+${timeAgo.format(data.next, 'time')}`
					: 'very soon'
				}
			</p>
		)}
	</Modal>
)

export default memo(PreviewProgressModal)
