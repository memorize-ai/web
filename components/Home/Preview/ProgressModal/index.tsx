import TimeAgo from 'javascript-time-ago'
import enLocale from 'javascript-time-ago/locale/en'
import cx from 'classnames'

import { PreviewProgressData, PREVIEW_MASTERED_STREAK } from 'hooks/usePreview'
import Modal from 'components/Modal'

import styles from './index.module.scss'

TimeAgo.addLocale(enLocale)
const timeAgo = new TimeAgo('en-US')

export interface PreviewProgressModalProps {
	data: PreviewProgressData | null
	isShowing: boolean
	setIsShowing(isShowing: boolean): void
}

const PreviewProgressModal = ({
	data,
	isShowing,
	setIsShowing
}: PreviewProgressModalProps) => (
	<Modal
		className={styles.root}
		isLazy={false}
		isShowing={isShowing}
		setIsShowing={setIsShowing}
	>
		<div className={styles.badges}>
			{data && data.xp > 0 && (
				<p className={cx(styles.badge, styles.xp)}>+{data.xp} xp</p>
			)}
			<p
				className={cx(styles.badge, styles.streak, {
					[styles.success]: (data?.streak ?? 0) > 0
				})}
			>
				{data?.streak} / {PREVIEW_MASTERED_STREAK} streak
			</p>
		</div>
		<p className={styles.emoji}>{data?.emoji}</p>
		<p className={styles.message}>{data?.message}</p>
		{data && (
			<p className={cx(styles.next, styles[`rating_${data.rating}`])}>
				{data.next ? `+${timeAgo.format(data.next, 'time')}` : 'very soon'}
			</p>
		)}
	</Modal>
)

export default PreviewProgressModal
