import React from 'react'
import { useHistory } from 'react-router-dom'
import {
	faPlus,
	faEdit,
	faShoppingCart,
	faShareAlt,
	faTimes,
	faTrash
} from '@fortawesome/free-solid-svg-icons'

import Deck from '../../../models/Deck'
import useCurrentUser from '../../../hooks/useCurrentUser'
import Action from './HeaderAction'

export default ({ deck }: { deck: Deck }) => {
	const history = useHistory()
	const [currentUser] = useCurrentUser()
	
	const isOwner = currentUser?.id === deck.creatorId
	
	return (
		<div className="header">
			<h1 className="name">{deck.name}</h1>
			<div className="actions">
				{isOwner && (
					<>
						<Action
							icon={faPlus}
							title="Add cards"
							onClick={() => console.log('Add cards')}
						/>
						<Action
							icon={faEdit}
							title="Edit"
							onClick={() => console.log('Edit')}
						/>
					</>
				)}
				<Action
					icon={faShoppingCart}
					title="Market"
					onClick={() => history.push(`/d/${deck.id}`)}
				/>
				<Action
					color="blue"
					icon={faShareAlt}
					title="Share"
					onClick={() => console.log('Share')}
				/>
				<Action
					color="red"
					icon={faTimes}
					title="Remove from library"
					onClick={() => console.log('Remove from library')}
				/>
				{isOwner && (
					<Action
						color="red"
						icon={faTrash}
						title="Delete"
						onClick={() => console.log('Delete')}
					/>
				)}
			</div>
		</div>
	)
}
