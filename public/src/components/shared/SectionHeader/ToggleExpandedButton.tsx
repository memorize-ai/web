import React, { memo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'

const SectionHeaderToggleExpandedButton = memo((
	{ degrees, toggle, children: isExpanded }: {
		degrees: number
		toggle?: () => void
		children: boolean
	}
) => (
	<button
		className="toggle-expanded-button"
		onClick={toggle}
		style={{ transform: `rotate(${degrees}deg)` }}
	>
		<FontAwesomeIcon icon={isExpanded ? faMinus : faPlus} />
	</button>
))

export default SectionHeaderToggleExpandedButton
