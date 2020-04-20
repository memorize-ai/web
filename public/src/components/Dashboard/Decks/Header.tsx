import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faStar as faStarFilled, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons'
import { faStar as faStarOutlined } from '@fortawesome/free-regular-svg-icons'
import cx from 'classnames'

import Deck from '../../../models/Deck'
import useCurrentUser from '../../../hooks/useCurrentUser'
import useImageUrl from '../../../hooks/useImageUrl'
import useRemoveDeckModal from '../../../hooks/useRemoveDeckModal'
import CreateSectionModal from './CreateSectionModal'
import ShareDeckModal from '../../shared/ShareDeckModal'
import ConfirmationModal from '../../shared/ConfirmationModal'
import Dropdown, { DropdownShadow } from '../../shared/Dropdown'
import RemoveDeckModal from '../../shared/RemoveDeckModal'
import { formatNumber } from '../../../utils'

import { ReactComponent as ShareIcon } from '../../../images/icons/share.svg'
import { ReactComponent as CartIcon } from '../../../images/icons/cart.svg'
import { ReactComponent as EditIcon } from '../../../images/icons/edit.svg'

export default ({ deck }: { deck: Deck | null }) => {
	const [currentUser] = useCurrentUser()
	const [imageUrl] = useImageUrl(deck)
	
	const [isCreateSectionModalShowing, setIsCreateSectionModalShowing] = useState(false)
	const [isShareModalShowing, setIsShareModalShowing] = useState(false)
	const [isDeleteModalShowing, setIsDeleteModalShowing] = useState(false)
	const [isOptionsDropdownShowing, setIsOptionsDropdownShowing] = useState(false)
	
	const [removeDeck, removeDeckModalProps] = useRemoveDeckModal()
	
	const isFavorite = deck?.userData?.isFavorite ?? false
	const isOwner = currentUser && deck?.creatorId === currentUser.id
	
	return (
		<div className={cx('header', { loading: !deck })}>
			<img src={imageUrl ?? Deck.DEFAULT_IMAGE_URL} alt="Deck" />
			<h1 className="name">
				{deck?.name}
			</h1>
			{currentUser && currentUser?.id === deck?.creatorId && (
				<button
					className="create-section"
					onClick={() => setIsCreateSectionModalShowing(true)}
				>
					Create section
				</button>
			)}
			<button className="share" onClick={() => setIsShareModalShowing(true)}>
				<ShareIcon />
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
				<Link to={`/d/${deck?.slugId ?? ''}/${deck?.slug ?? ''}`}>
					<CartIcon className="cart" />
					<p>Visit page</p>
				</Link>
				{isOwner && (
					<button onClick={() => console.log('Edit deck')}>
						<EditIcon className="edit" />
						<p>Edit deck</p>
					</button>
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
							onConfirm={() => {
								deck.delete(currentUser.id)
								
								setIsOptionsDropdownShowing(false)
								setIsDeleteModalShowing(false)
							}}
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
