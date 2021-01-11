import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'

import styles from './index.module.scss'

export interface SectionHeaderToggleExpandedButtonProps {
	degrees: number
	toggle?(): void
	children: boolean
}

const SectionHeaderToggleExpandedButton = ({
	degrees,
	toggle,
	children: isExpanded
}: SectionHeaderToggleExpandedButtonProps) => (
	<button
		className={styles.root}
		onClick={toggle}
		style={{ transform: `rotate(${degrees}deg)` }}
	>
		<FontAwesomeIcon
			className={styles.icon}
			icon={isExpanded ? faMinus : faPlus}
		/>
	</button>
)

export default SectionHeaderToggleExpandedButton
