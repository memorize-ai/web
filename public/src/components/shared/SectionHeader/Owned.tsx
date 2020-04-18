import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faEllipsisV } from '@fortawesome/free-solid-svg-icons'

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
	const [degrees, setDegrees] = useState(0)
	const [isOptionsDropdownShowing, setIsOptionsDropdownShowing] = useState(false)
	
	const onClick = () => {
		toggleExpanded()
		setDegrees(degrees + 180)
	}
	
	return (
		<div className="section-header owned" onClick={onClick}>
			{deck.isSectionUnlocked(section) || (
				<button
					className="unlock"
					onClick={event => {
						event.stopPropagation()
						onUnlock()
					}}
				>
					<FontAwesomeIcon icon={faLock} />
				</button>
			)}
			<p className="name">
				{section.name}
			</p>
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
