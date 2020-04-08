import React, { useState } from 'react'
import Modal from 'react-modal'
import { faSignature } from '@fortawesome/free-solid-svg-icons'

import { MODAL_Z_INDEX } from '../../constants'
import Deck from '../../models/Deck'
import Section from '../../models/Section'
import LoadingState from '../../models/LoadingState'
import Input from '../shared/Input'
import Button from '../shared/Button'

import '../../scss/components/CreateCardPopUp/CreateSectionModal.scss'
import useSections from '../../hooks/useSections'

export default (
	{ deck, isShowing, hide }: {
		deck: Deck
		isShowing: boolean
		hide: () => void
	}
) => {
	const [name, setName] = useState('')
	const [publishLoadingState, setPublishLoadingState] = useState(LoadingState.None)
	
	const sections = useSections(deck.id)
	
	const isPublishButtonLoading = publishLoadingState === LoadingState.Loading
	const isPublishButtonDisabled = !name
	
	const createSection = async () => {
		try {
			setPublishLoadingState(LoadingState.Loading)
			
			await Section.createForDeck(deck, name, sections.length)
			
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
			<div className="create-card-pop-up create-section-modal">
				<h1 className="title">Create section</h1>
				<Input
					className="name-input"
					icon={faSignature}
					type="name"
					placeholder="Name (required)"
					value={name}
					setValue={setName}
				/>
				<div className="publish-button-container">
					<Button
						className="publish-button"
						loaderSize="16px"
						loaderThickness="3px"
						loaderColor="#63b3ed"
						loading={isPublishButtonLoading}
						disabled={isPublishButtonDisabled}
						onClick={createSection}
					>
						Create
					</Button>
				</div>
			</div>
		</Modal>
	)
}
