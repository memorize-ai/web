import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUnlock, faLock, faEllipsisV } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import Deck from '../../../models/Deck'
import Section from '../../../models/Section'
import ToggleExpandedButton from './ToggleExpandedButton'
import Dropdown, { DropdownShadow } from '../Dropdown'
import { formatNumber } from '../../../utils'

import { ReactComponent as ShareIcon } from '../../../images/icons/share.svg'

import '../../../scss/components/SectionHeader/Owned.scss'

export default (
	{ deck, section, isExpanded, toggleExpanded, onUnlock, onShare }: {
		deck: Deck
		section: Section
		isExpanded: boolean
		toggleExpanded: () => void
		onUnlock: () => void
		onShare: () => void
	}
) => {
	const [isHoveringLock, setIsHoveringLock] = useState(false)
	const [degrees, setDegrees] = useState(0)
	const [isOptionsDropdownShowing, setIsOptionsDropdownShowing] = useState(false)
	
	const isUnlocked = deck.isSectionUnlocked(section)
	const numberOfDueCards = deck.numberOfCardsDueForSection(section)
	
	const onClick = () => {
		toggleExpanded()
		setDegrees(degrees + 180)
	}
	
	return (
		<div
			className={cx('section-header', 'owned', { due: numberOfDueCards > 0 })}
			onClick={onClick}
		>
			{isUnlocked || (
				<button
					className="unlock"
					onClick={event => {
						event.stopPropagation()
						onUnlock()
					}}
					onMouseEnter={() => setIsHoveringLock(true)}
					onMouseLeave={() => setIsHoveringLock(false)}
				>
					<FontAwesomeIcon icon={isHoveringLock ? faUnlock : faLock} />
				</button>
			)}
			<div className="name">
				<p>{section.name}</p>
				{numberOfDueCards > 0 && (
					<p className="badge">
						{formatNumber(numberOfDueCards)} due
					</p>
				)}
			</div>
			<div className="divider" />
			<p className="card-count">
				({formatNumber(section.numberOfCards)} card{section.numberOfCards === 1 ? '' : 's'})
			</p>
			<ToggleExpandedButton degrees={degrees}>
				{isExpanded}
			</ToggleExpandedButton>
			{section.isUnsectioned || (
				<>
					<button
						className="share"
						onClick={event => {
							event.stopPropagation()
							onShare()
						}}
					>
						<ShareIcon />
					</button>
					<Dropdown
						className="options"
						shadow={DropdownShadow.Around}
						trigger={<FontAwesomeIcon icon={faEllipsisV} />}
						isShowing={isOptionsDropdownShowing}
						setIsShowing={setIsOptionsDropdownShowing}
					>
						Options
					</Dropdown>
				</>
			)}
		</div>
	)
}
