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
				currentUser?.uid,
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
			<h1 className="mb-4 text-4xl text-center font-bold">
				Create deck
			</h1>
			<Input
				className="mb-3"
				icon={faSignature}
				type="name"
				placeholder="Name (required)"
				value={name}
				setValue={setName}
			/>
			<Input
				className="mb-3"
				icon={faAlignLeft}
				type="name"
				placeholder="Subtitle (optional)"
				value={subtitle}
				setValue={setSubtitle}
			/>
			<TextArea
				className="mb-2"
				minHeight={100}
				placeholder="Description (optional)"
				value={description}
				setValue={setDescription}
			/>
			<div className="flex">
				<Button
					className={`
						h-12
						mx-auto
						px-8
						text-blue-${isPublishButtonDisabled ? 200 : 400}
						${isPublishButtonDisabled || isPublishButtonLoading ? '' : 'hover:text-white'}
						font-bold
						uppercase
						text-xl
						border-2
						border-blue-${isPublishButtonDisabled ? 200 : 400}
						${isPublishButtonDisabled || isPublishButtonLoading ? '' : 'hover:bg-blue-400'}
						rounded
					`}
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
		</Modal>
	)
}
