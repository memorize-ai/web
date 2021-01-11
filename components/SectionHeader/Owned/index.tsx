import { useState, useCallback } from 'react'
import Link from 'next/link'
import { Svg } from 'react-optimized-image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faUnlock,
	faLock,
	faEllipsisV,
	faAngleUp,
	faAngleDown,
	faTrash
} from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import Deck from 'models/Deck'
import Section from 'models/Section'
import useCurrentUser from 'hooks/useCurrentUser'
import ToggleExpandedButton from '../ToggleExpandedButton'
import Dropdown, { DropdownShadow } from 'components/Dropdown'
import { formatNumber } from 'lib/utils'

import share from 'images/icons/share.svg'
import pencil from 'images/icons/pencil.svg'
import decks from 'images/icons/decks.svg'

const OwnedSectionHeader = ({
	deck,
	section,
	isExpanded,
	toggleExpanded,
	onUnlock,
	onRename,
	onDelete,
	onShare,
	numberOfSections,
	reorder
}: {
	deck: Deck
	section: Section
	isExpanded: boolean
	toggleExpanded: () => void
	onUnlock: () => void
	onRename: () => void
	onDelete: () => void
	onShare: () => void
	numberOfSections: number
	reorder: (delta: number) => void
}) => {
	const [currentUser] = useCurrentUser()

	const [isHoveringLock, setIsHoveringLock] = useState(false)
	const [degrees, setDegrees] = useState(0)
	const [isOptionsDropdownShowing, setIsOptionsDropdownShowing] = useState(
		false
	)

	const isUnlocked = deck.isSectionUnlocked(section)

	const numberOfDueCards = deck.numberOfCardsDueForSection(section)
	const numberOfDueCardsFormatted = formatNumber(numberOfDueCards)

	const { numberOfCards } = section
	const numberOfCardsFormatted = formatNumber(numberOfCards)

	const isOwner = deck.creatorId === currentUser?.id

	const canReorderUp = section.index > 0
	const canReorderDown = section.index < numberOfSections - 1

	const onClick = useCallback(() => {
		toggleExpanded()
		setDegrees(degrees => degrees + 180)
	}, [toggleExpanded, setDegrees])

	return (
		<div
			className={cx('section-header', 'owned', {
				due: numberOfDueCards > 0
			})}
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
			{isOwner && !section.isUnsectioned && (canReorderUp || canReorderDown) && (
				<div className="reorder">
					{canReorderUp && (
						<button
							onClick={event => {
								event.stopPropagation()
								reorder(-1)
							}}
						>
							<FontAwesomeIcon icon={faAngleUp} />
						</button>
					)}
					{canReorderDown && (
						<button
							onClick={event => {
								event.stopPropagation()
								reorder(1)
							}}
						>
							<FontAwesomeIcon icon={faAngleDown} />
						</button>
					)}
				</div>
			)}
			<div className="name">
				<p>{section.name}</p>
				{numberOfDueCards > 0 && (
					<p className="badge">{numberOfDueCardsFormatted} due</p>
				)}
			</div>
			<div className="divider" />
			{isUnlocked && numberOfCards > 0 && (
				<>
					<Link href={deck.reviewUrl(section)}>
						<a
							className={cx('review-link', {
								disabled: !numberOfDueCards
							})}
							aria-label={`Review cards only in ${section.name}`}
							data-balloon-pos="up"
						>
							<p>
								Review
								{numberOfDueCards > 0 ? ` ${numberOfDueCardsFormatted}` : ''}
							</p>
							{numberOfDueCards > 0 && <Svg src={decks} />}
						</a>
					</Link>
					<Link href={deck.cramUrl(section)}>
						<a
							className="cram-link"
							aria-label={`Cram cards only in ${section.name}`}
							data-balloon-pos="up"
						>
							<p>Cram {numberOfCardsFormatted}</p>
							<Svg src={decks} />
						</a>
					</Link>
				</>
			)}
			<p className="card-count">
				({numberOfCardsFormatted} card{numberOfCards === 1 ? '' : 's'})
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
						<Svg src={share} />
					</button>
					{(isOwner || !isUnlocked) && (
						<Dropdown
							className="options"
							shadow={DropdownShadow.Around}
							trigger={<FontAwesomeIcon icon={faEllipsisV} />}
							isShowing={isOptionsDropdownShowing}
							setIsShowing={setIsOptionsDropdownShowing}
						>
							{isUnlocked || (
								<button
									onClick={onUnlock}
									onMouseEnter={() => setIsHoveringLock(true)}
									onMouseLeave={() => setIsHoveringLock(false)}
								>
									<FontAwesomeIcon
										icon={isHoveringLock ? faUnlock : faLock}
										className="unlock"
									/>
									<p>Unlock</p>
								</button>
							)}
							{isOwner && !isUnlocked && <div className="divider" />}
							{isOwner && (
								<>
									<button onClick={onRename}>
										<Svg className="rename" src={pencil} />
										<p>Rename</p>
									</button>
									<button onClick={onDelete}>
										<FontAwesomeIcon icon={faTrash} className="delete" />
										<p>Delete</p>
									</button>
								</>
							)}
						</Dropdown>
					)}
				</>
			)}
		</div>
	)
}

export default OwnedSectionHeader
