import React, { useState } from 'react'
import Modal from 'react-modal'
import { faSignature } from '@fortawesome/free-solid-svg-icons'

import { MODAL_Z_INDEX } from '../../constants'
import Deck from '../../models/Deck'
import Section from '../../models/Section'
import LoadingState from '../../models/LoadingState'
import Input from '../shared/Input'
import Button from '../shared/Button'

export default (
	{ deck, isShowing, hide }: {
		deck: Deck
		isShowing: boolean
		hide: () => void
	}
) => {
	const [name, setName] = useState('')
	const [publishLoadingState, setPublishLoadingState] = useState(LoadingState.None)
	
	const isPublishButtonLoading = publishLoadingState === LoadingState.Loading
	const isPublishButtonDisabled = !name
	
	const createSection = async () => {
		try {
			setPublishLoadingState(LoadingState.Loading)
			
			await Section.createForDeck(deck, name)
			
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
				Create section
			</h1>
			<Input
				className="mb-3"
				icon={faSignature}
				type="name"
				placeholder="Name (required)"
				value={name}
				setValue={setName}
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
					onClick={createSection}
				>
					Create
				</Button>
			</div>
		</Modal>
	)
}
