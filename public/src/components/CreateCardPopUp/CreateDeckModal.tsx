import React, { useState } from 'react'
import Modal from 'react-modal'
import { faSignature, faAlignLeft } from '@fortawesome/free-solid-svg-icons'

import { MODAL_Z_INDEX } from '../../constants'
import Deck from '../../models/Deck'
import LoadingState from '../../models/LoadingState'
import useCurrentUser from '../../hooks/useCurrentUser'
import Input from '../shared/Input'
import TextArea from '../shared/TextArea'
import Button from '../shared/Button'

import '../../scss/components/CreateCardPopUp/CreateDeckModal.scss'

export default (
	{ isShowing, hide }: {
		isShowing: boolean
		hide: () => void
	}
) => {
	const [currentUser, currentUserLoadingState] = useCurrentUser()
	
	const [name, setName] = useState('')
	const [subtitle, setSubtitle] = useState('')
	const [description, setDescription] = useState('')
	const [publishLoadingState, setPublishLoadingState] = useState(LoadingState.None)
	
	const isPublishButtonLoading = publishLoadingState === LoadingState.Loading
	const isPublishButtonDisabled = !name || currentUserLoadingState === LoadingState.Loading
	
	const createDeck = async () => {
		if (!currentUser)
			return
		
		try {
			setPublishLoadingState(LoadingState.Loading)
			
			await Deck.createForUserWithId(
				currentUser.id,
				{ name, subtitle, description }
			)
			
			setPublishLoadingState(LoadingState.Success)
			hide()
		} catch (error) {
			setPublishLoadingState(LoadingState.Fail)
			console.error(error)
			alert(error.message)
		}
	}
	
	return (
		<Modal
			isOpen={isShowing}
			onRequestClose={hide}
			style={{
				overlay: { zIndex: MODAL_Z_INDEX }
			}}
		>
			<div className="create-card-pop-up create-deck-modal">
				<h1 className="title">Create deck</h1>
				<div className="fields">
					<Input
						icon={faSignature}
						type="name"
						placeholder="Name (required)"
						value={name}
						setValue={setName}
					/>
					<Input
						icon={faAlignLeft}
						type="name"
						placeholder="Subtitle (optional)"
						value={subtitle}
						setValue={setSubtitle}
					/>
					<TextArea
						minHeight={100}
						placeholder="Description (optional)"
						value={description}
						setValue={setDescription}
					/>
				</div>
				<div className="publish-button-container">
					<Button
						className="publish-button"
						type="submit"
						loaderSize="16px"
						loaderThickness="3px"
						loaderColor="#63b3ed"
						loading={isPublishButtonLoading}
						disabled={isPublishButtonDisabled}
						onClick={createDeck}
					>
						Create
					</Button>
				</div>
			</div>
		</Modal>
	)
}
