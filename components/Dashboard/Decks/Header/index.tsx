import { useState, useCallback } from 'react'
import Link from 'next/link'
import { Svg } from 'react-optimized-image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faBars,
	faStar as faStarFilled,
	faTimes,
	faTrash
} from '@fortawesome/free-solid-svg-icons'
import { faStar as faStarOutlined } from '@fortawesome/free-regular-svg-icons'
import cx from 'classnames'

import Deck from 'models/Deck'
import useCurrentUser from 'hooks/useCurrentUser'
import useRemoveDeckModal from 'hooks/useRemoveDeckModal'
import CreateSectionModal from 'components/Modal/CreateSection'
import ShareDeckModal from 'components/Modal/ShareDeck'
import ConfirmationModal from 'components/Modal/Confirmation'
import Dropdown, { DropdownShadow } from 'components/Dropdown'
import RemoveDeckModal from 'components/Modal/RemoveDeck'
import formatNumber from 'lib/formatNumber'

import { src as defaultImage } from 'images/logos/icon.jpg'
import share from 'images/icons/share.svg'
import cart from 'images/icons/cart.svg'
import edit from 'images/icons/edit.svg'
import decks from 'images/icons/decks.svg'

import styles from './index.module.scss'

export interface DecksHeaderProps {
	deck: Deck | null
}

const DecksHeader = ({ deck }: DecksHeaderProps) => {
	const [currentUser] = useCurrentUser()

	const [
		isCreateSectionModalShowing,
		setIsCreateSectionModalShowing
	] = useState(false)
	const [isShareModalShowing, setIsShareModalShowing] = useState(false)
	const [isDeleteModalShowing, setIsDeleteModalShowing] = useState(false)
	const [isOptionsDropdownShowing, setIsOptionsDropdownShowing] = useState(
		false
	)
	const [removeDeck, removeDeckModalProps] = useRemoveDeckModal()

	const isFavorite = deck?.userData?.isFavorite ?? false
	const isOwner = currentUser && deck?.creatorId === currentUser.id
	const numberOfUnlockedCards = deck?.userData?.numberOfUnlockedCards ?? 0
	const numberOfUnlockedCardsFormatted = formatNumber(numberOfUnlockedCards)
	const numberOfDueCards = deck?.userData?.numberOfDueCards ?? 0
	const numberOfDueCardsFormatted = formatNumber(numberOfDueCards)

	const onConfirmDelete = useCallback(() => {
		if (!(deck && currentUser)) return

		deck.delete(currentUser.id)

		setIsOptionsDropdownShowing(false)
		setIsDeleteModalShowing(false)
	}, [deck, currentUser, setIsOptionsDropdownShowing, setIsDeleteModalShowing])

	return (
		<div
			className={cx(styles.root, {
				[styles.owned]: isOwner,
				[styles.loading]: !deck
			})}
		>
			<img
				className={styles.image}
				src={deck?.imageUrl ?? defaultImage}
				alt="Deck"
			/>
			<h1 className={styles.name}>{deck?.name}</h1>
			{deck && (
				<>
					<Link href={deck.reviewUrl()}>
						<a
							className={cx(styles.review, {
								[styles.disabledAction]: !numberOfDueCards
							})}
							aria-label="The magic of memorize.ai - efficient long-term memorization"
							data-balloon-pos="up"
						>
							<span>
								Review
								{numberOfDueCards > 0 && ` ${numberOfDueCardsFormatted}`}
							</span>
							{numberOfDueCards > 0 && (
								<Svg className={styles.actionIcon} src={decks} />
							)}
						</a>
					</Link>
					<Link href={deck.cramUrl()}>
						<a
							className={cx(styles.cram, {
								[styles.disabledAction]: !numberOfUnlockedCards
							})}
							aria-label="Fast and easy - perfect right before an exam"
							data-balloon-pos="up"
						>
							<span>
								Cram
								{numberOfUnlockedCards > 0 &&
									` ${numberOfUnlockedCardsFormatted}`}
							</span>
							{numberOfUnlockedCards > 0 && (
								<Svg className={styles.actionIcon} src={decks} />
							)}
						</a>
					</Link>
				</>
			)}
			{currentUser && currentUser?.id === deck?.creatorId && (
				<button
					className={styles.createSection}
					onClick={() => setIsCreateSectionModalShowing(true)}
				>
					Create section
				</button>
			)}
			<button
				className={styles.share}
				onClick={() => setIsShareModalShowing(true)}
			>
				<Svg className={styles.shareIcon} src={share} />
			</button>
			<Dropdown
				className={styles.options}
				triggerClassName={styles.optionsTrigger}
				contentClassName={styles.optionsContent}
				shadow={DropdownShadow.Screen}
				trigger={
					<FontAwesomeIcon
						className={styles.optionsTriggerIcon}
						icon={faBars}
					/>
				}
				isShowing={isOptionsDropdownShowing}
				setIsShowing={setIsOptionsDropdownShowing}
			>
				<button
					className={styles.option}
					onClick={() => currentUser && deck?.toggleFavorite(currentUser.id)}
				>
					<FontAwesomeIcon
						className={cx(styles.optionIcon, styles.star)}
						icon={isFavorite ? faStarFilled : faStarOutlined}
					/>
					<span className={styles.optionName}>
						{isFavorite ? 'Unf' : 'F'}avorite (
						{formatNumber(deck?.numberOfFavorites ?? 0)})
					</span>
				</button>
				<Link href={deck?.url ?? '/market'}>
					<a className={styles.option}>
						<Svg className={cx(styles.optionIcon, styles.cart)} src={cart} />
						<span className={styles.optionName}>Visit page</span>
					</a>
				</Link>
				{isOwner && (
					<Link
						href={`/edit/${deck?.slugId ?? ''}/${
							deck ? encodeURIComponent(deck.slug) : ''
						}`}
					>
						<a className={styles.option}>
							<Svg className={cx(styles.optionIcon, styles.edit)} src={edit} />
							<span className={styles.optionName}>Edit deck</span>
						</a>
					</Link>
				)}
				<div className={styles.optionDivider} />
				<button
					className={styles.option}
					onClick={() => deck && removeDeck(deck)}
				>
					<FontAwesomeIcon
						className={cx(styles.optionIcon, styles.remove)}
						icon={faTimes}
					/>
					<span className={styles.optionName}>Remove from library</span>
				</button>
				{isOwner && (
					<button
						className={styles.option}
						onClick={() => setIsDeleteModalShowing(true)}
					>
						<FontAwesomeIcon
							className={cx(styles.optionIcon, styles.delete)}
							icon={faTrash}
						/>
						<span className={styles.optionName}>Permanently delete</span>
					</button>
				)}
			</Dropdown>
			{deck && (
				<>
					<CreateSectionModal
						deck={deck}
						isShowing={isCreateSectionModalShowing}
						setIsShowing={setIsCreateSectionModalShowing}
					/>
					<ShareDeckModal
						deck={deck}
						isShowing={isShareModalShowing}
						setIsShowing={setIsShareModalShowing}
					/>
					<RemoveDeckModal {...removeDeckModalProps} />
					{isOwner && currentUser && (
						<ConfirmationModal
							title="Permanently delete deck"
							message="Are you sure? You cannot recover this deck."
							onConfirm={onConfirmDelete}
							buttonText="Delete"
							buttonBackground="#e53e3e"
							isShowing={isDeleteModalShowing}
							setIsShowing={setIsDeleteModalShowing}
						/>
					)}
				</>
			)}
		</div>
	)
}

export default DecksHeader
