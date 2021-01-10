import { CramProgressData, CRAM_MASTERED_STREAK } from './useCramState'
import Modal from 'components/Modal'

const CramProgressModal = ({
	data,
	isShowing,
	setIsShowing
}: {
	data: CramProgressData | null
	isShowing: boolean
	setIsShowing: (isShowing: boolean) => void
}) => {
	const isMastered = (data?.streak ?? 0) >= CRAM_MASTERED_STREAK
	const didEarnXp = (data?.xp ?? 0) > 0

	return (
		<Modal
			className="cram-progress"
			isShowing={isShowing}
			setIsShowing={setIsShowing}
		>
			<div className="badges">
				{data && didEarnXp && <p className="badge xp">+{data.xp} xp</p>}
				<p className="badge streak">
					{data?.streak} / {CRAM_MASTERED_STREAK} streak
				</p>
			</div>
			<p className="emoji">{isMastered ? '🥳' : data?.emoji}</p>
			<p className="message">{isMastered ? 'Mastered!' : data?.message}</p>
		</Modal>
	)
}

export default CramProgressModal
