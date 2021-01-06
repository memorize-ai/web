import { useState, useCallback } from 'react'
import Link from 'next/link'
import { Svg } from 'react-optimized-image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faPrint, faStar as faStarFilled, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons'
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
import { formatNumber } from 'lib/utils'

import { src as defaultImage } from 'images/logos/icon.jpg'
import share from 'images/icons/share.svg'
import cart from 'images/icons/cart.svg'
import edit from 'images/icons/edit.svg'
import decks from 'images/icons/decks.svg'

const DecksHeader = ({ deck }: { deck: Deck | null }) => {
	const [currentUser] = useCurrentUser()
	
	const [isCreateSectionModalShowing, setIsCreateSectionModalShowing] = useState(false)
	const [isShareModalShowing, setIsShareModalShowing] = useState(false)
	const [isDeleteModalShowing, setIsDeleteModalShowing] = useState(false)
	const [isOptionsDropdownShowing, setIsOptionsDropdownShowing] = useState(false)
	const [removeDeck, removeDeckModalProps] = useRemoveDeckModal()
	
	const isFavorite = deck?.userData?.isFavorite ?? false
	const isOwner = currentUser && deck?.creatorId === currentUser.id
	const numberOfUnlockedCards = deck?.userData?.numberOfUnlockedCards ?? 0
	const numberOfUnlockedCardsFormatted = formatNumber(numberOfUnlockedCards)
	const numberOfDueCards = deck?.userData?.numberOfDueCards ?? 0
	const numberOfDueCardsFormatted = formatNumber(numberOfDueCards)
	
	const onConfirmDelete = useCallback(() => {
		if (!(deck && currentUser))
			return
		
		deck.delete(currentUser.id)
		
		setIsOptionsDropdownShowing(false)
		setIsDeleteModalShowing(false)
	}, [deck, currentUser, setIsOptionsDropdownShowing, setIsDeleteModalShowing])
	
	return (
		<div className={cx('header', { owned: isOwner, loading: !deck })}>
			<img src={deck?.imageUrl ?? defaultImage} alt="Deck" />
			<h1 className="name">
				{deck?.name}
			</h1>
			{deck && (
				<>
					<Link href={deck.reviewUrl()}>
						<a
							className={cx('review-button', { disabled: !numberOfDueCards })}
							aria-label="The magic of memorize.ai - efficient long-term memorization"
							data-balloon-pos="up"
						>
							<p>Review{numberOfDueCards > 0 && ` ${numberOfDueCardsFormatted}`}</p>
							{numberOfDueCards > 0 && <Svg src={decks} />}
						</a>
					</Link>
					<Link href={deck.cramUrl()}>
						<a
							className={cx('cram-button', { disabled: !numberOfUnlockedCards })}
							aria-label="Fast and easy - perfect right before an exam"
							data-balloon-pos="up"
						>
							<p>Cram{numberOfUnlockedCards > 0 && ` ${numberOfUnlockedCardsFormatted}`}</p>
							{numberOfUnlockedCards > 0 && <Svg src={decks} />}
						</a>
					</Link>
				</>
			)}
			{currentUser && currentUser?.id === deck?.creatorId && (
				<button
					className="create-section"
					onClick={() => setIsCreateSectionModalShowing(true)}
				>
					Create section
				</button>
			)}
			<button className="share" onClick={() => setIsShareModalShowing(true)}>
				<Svg src={share} />
			</button>
			<Dropdown
				className="options"
				shadow={DropdownShadow.Screen}
				trigger={<FontAwesomeIcon icon={faBars} />}
				isShowing={isOptionsDropdownShowing}
				setIsShowing={setIsOptionsDropdownShowing}
			>
				<button onClick={() => currentUser && deck?.toggleFavorite(currentUser.id)}>
					<FontAwesomeIcon
						icon={isFavorite ? faStarFilled : faStarOutlined}
						className="star"
					/>
					<p>{isFavorite ? 'Unf' : 'F'}avorite ({formatNumber(deck?.numberOfFavorites ?? 0)})</p>
				</button>
				<a href={deck?.printUrl} rel="noopener noreferrer" target="_blank">
					<FontAwesomeIcon icon={faPrint} className="print" />
					<p>Print</p>
				</a>
				<Link href={deck?.url ?? '/market'}>
					<a>
						<Svg className="cart" src={cart} />
						<p>Visit page</p>
					</a>
				</Link>
				{isOwner && (
					<Link href={`/edit/${deck?.slugId ?? ''}/${deck?.slug ?? ''}`}>
						<a>
							<Svg className="edit" src={edit} />
							<p>Edit deck</p>
						</a>
					</Link>
				)}
				<div className="divider" />
				<button onClick={() => deck && removeDeck(deck)}>
					<FontAwesomeIcon icon={faTimes} className="destructive remove" />
					<p>Remove from library</p>
				</button>
				{isOwner && (
					<button onClick={() => setIsDeleteModalShowing(true)}>
						<FontAwesomeIcon icon={faTrash} className="destructive delete" />
						<p>Permanently delete</p>
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
