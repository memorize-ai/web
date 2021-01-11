import { useState, useCallback, MouseEvent } from 'react'
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

import shareIcon from 'images/icons/share.svg'
import pencilIcon from 'images/icons/pencil.svg'
import decksIcon from 'images/icons/decks.svg'

import styles from './index.module.scss'

export interface OwnedSectionHeaderProps {
	deck: Deck
	section: Section
	isExpanded: boolean
	toggleExpanded(): void
	onUnlock(): void
	onRename(): void
	onDelete(): void
	onShare(): void
	numberOfSections: number
	reorder(delta: number): void
}

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
}: OwnedSectionHeaderProps) => {
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

	const unlock = useCallback(
		(event: MouseEvent<HTMLButtonElement>) => {
			event.stopPropagation()
			onUnlock()
		},
		[onUnlock]
	)

	const share = useCallback(
		(event: MouseEvent<HTMLButtonElement>) => {
			event.stopPropagation()
			onShare()
		},
		[onShare]
	)

	return (
		<div
			className={cx(styles.root, {
				[styles.due]: numberOfDueCards > 0
			})}
			onClick={onClick}
		>
			{isUnlocked || (
				<button
					className={styles.unlock}
					onClick={unlock}
					onMouseEnter={() => setIsHoveringLock(true)}
					onMouseLeave={() => setIsHoveringLock(false)}
				>
					<FontAwesomeIcon icon={isHoveringLock ? faUnlock : faLock} />
				</button>
			)}
			{isOwner && !section.isUnsectioned && (canReorderUp || canReorderDown) && (
				<div className={styles.reorder}>
					{canReorderUp && (
						<button
							className={styles.reorderButton}
							onClick={event => {
								event.stopPropagation()
								reorder(-1)
							}}
						>
							<FontAwesomeIcon
								className={styles.reorderIcon}
								icon={faAngleUp}
							/>
						</button>
					)}
					{canReorderDown && (
						<button
							className={styles.reorderButton}
							onClick={event => {
								event.stopPropagation()
								reorder(1)
							}}
						>
							<FontAwesomeIcon
								className={styles.reorderIcon}
								icon={faAngleDown}
							/>
						</button>
					)}
				</div>
			)}
			<div className={styles.name}>
				<p>{section.name}</p>
				{numberOfDueCards > 0 && (
					<p className={styles.badge}>{numberOfDueCardsFormatted} due</p>
				)}
			</div>
			<div className={styles.divider} />
			{isUnlocked && numberOfCards > 0 && (
				<>
					<Link href={deck.reviewUrl(section)}>
						<a
							className={cx(styles.link, styles.review, {
								[styles.disabledLink]: !numberOfDueCards
							})}
							aria-label={`Review cards only in ${section.name}`}
							data-balloon-pos="up"
						>
							<span className={styles.linkText}>
								Review
								{numberOfDueCards > 0 ? ` ${numberOfDueCardsFormatted}` : ''}
							</span>
							{numberOfDueCards > 0 && (
								<Svg className={styles.linkIcon} src={decksIcon} />
							)}
						</a>
					</Link>
					<Link href={deck.cramUrl(section)}>
						<a
							className={cx(styles.link, styles.cram)}
							aria-label={`Cram cards only in ${section.name}`}
							data-balloon-pos="up"
						>
							<span className={styles.linkText}>
								Cram {numberOfCardsFormatted}
							</span>
							<Svg className={styles.linkIcon} src={decksIcon} />
						</a>
					</Link>
				</>
			)}
			<p className={styles.cards}>
				({numberOfCardsFormatted} card{numberOfCards === 1 ? '' : 's'})
			</p>
			<ToggleExpandedButton degrees={degrees}>
				{isExpanded}
			</ToggleExpandedButton>
			{section.isUnsectioned || (
				<>
					<button className={styles.share} onClick={share}>
						<Svg className={styles.shareIcon} src={shareIcon} />
					</button>
					{(isOwner || !isUnlocked) && (
						<Dropdown
							className={styles.options}
							triggerClassName={styles.optionsTrigger}
							contentClassName={styles.optionsContent}
							shadow={DropdownShadow.Around}
							trigger={<FontAwesomeIcon icon={faEllipsisV} />}
							isShowing={isOptionsDropdownShowing}
							setIsShowing={setIsOptionsDropdownShowing}
						>
							{isUnlocked || (
								<button
									className={styles.option}
									onClick={onUnlock}
									onMouseEnter={() => setIsHoveringLock(true)}
									onMouseLeave={() => setIsHoveringLock(false)}
								>
									<FontAwesomeIcon
										className={cx(styles.optionIcon, styles.optionIcon_unlock)}
										icon={isHoveringLock ? faUnlock : faLock}
									/>
									<p className={styles.optionName}>Unlock</p>
								</button>
							)}
							{isOwner && !isUnlocked && (
								<div className={styles.optionDivider} />
							)}
							{isOwner && (
								<>
									<button className={styles.option} onClick={onRename}>
										<Svg
											className={cx(
												styles.optionIcon,
												styles.optionIcon_rename
											)}
											src={pencilIcon}
										/>
										<p className={styles.optionName}>Rename</p>
									</button>
									<button className={styles.option} onClick={onDelete}>
										<FontAwesomeIcon
											className={cx(
												styles.optionIcon,
												styles.optionIcon_delete
											)}
											icon={faTrash}
										/>
										<p className={styles.optionName}>Delete</p>
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
