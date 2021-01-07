import TimeAgo from 'javascript-time-ago'
import enLocale from 'javascript-time-ago/locale/en'
import cx from 'classnames'

import { PreviewProgressData, PREVIEW_MASTERED_STREAK } from './usePreview'
import Modal from 'components/Modal'

TimeAgo.addLocale(enLocale)
const timeAgo = new TimeAgo('en-US')

const PreviewProgressModal = ({
	data,
	isShowing,
	setIsShowing
}: {
	data: PreviewProgressData | null
	isShowing: boolean
	setIsShowing: (isShowing: boolean) => void
}) => (
	<Modal
		className="preview-progress"
		isLazy={false}
		isShowing={isShowing}
		setIsShowing={setIsShowing}
	>
		<div className="badges">
			{data && data.xp > 0 && <p className="badge xp">+{data.xp} xp</p>}
			<p
				className={cx('badge', 'streak', {
					success: (data?.streak ?? 0) > 0
				})}
			>
				{data?.streak} / {PREVIEW_MASTERED_STREAK} streak
			</p>
		</div>
		<p className="emoji">{data?.emoji}</p>
		<p className="message">{data?.message}</p>
		{data && (
			<p className={`next rating-${data.rating}`}>
				{data.next ? `+${timeAgo.format(data.next, 'time')}` : 'very soon'}
			</p>
		)}
	</Modal>
)

export default PreviewProgressModal
