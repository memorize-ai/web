import { CramProgressData, CRAM_MASTERED_STREAK } from '../useCramState'
import Modal from 'components/Modal'

import styles from './index.module.scss'

export interface CramProgressModalProps {
	data: CramProgressData | null
	isShowing: boolean
	setIsShowing(isShowing: boolean): void
}

const CramProgressModal = ({
	data,
	isShowing,
	setIsShowing
}: CramProgressModalProps) => {
	const isMastered = (data?.streak ?? 0) >= CRAM_MASTERED_STREAK
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
					{data?.streak} / {CRAM_MASTERED_STREAK} streak
				</p>
			</div>
			<span className={styles.emoji} role="img" aria-hidden>
				{isMastered ? '🥳' : data?.emoji}
			</span>
			<p className={styles.message}>
				{isMastered ? 'Mastered!' : data?.message}
			</p>
		</Modal>
	)
}

export default CramProgressModal
