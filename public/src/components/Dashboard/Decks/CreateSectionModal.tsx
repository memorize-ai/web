import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle, faSignature } from '@fortawesome/free-solid-svg-icons'

import Deck from '../../../models/Deck'
import Section from '../../../models/Section'
import LoadingState from '../../../models/LoadingState'
import Modal from '../../shared/Modal'
import Input from '../../shared/Input'
import Button from '../../shared/Button'
import useSections from '../../../hooks/useSections'

export default (
	{ deck, isShowing, setIsShowing }: {
		deck: Deck
		isShowing: boolean
		setIsShowing: (isShowing: boolean) => void
	}
) => {
	const sections = useSections(deck.id)
	
	const [name, setName] = useState('')
	const [loadingState, setLoadingState] = useState(LoadingState.None)
	
	const isLoading = loadingState === LoadingState.Loading
	const isDisabled = !name
	
	const create = async () => {
		try {
			setLoadingState(LoadingState.Loading)
			
			await Section.createForDeck(deck, name, sections.length)
			
			setLoadingState(LoadingState.Success)
			setIsShowing(false)
		} catch (error) {
			setLoadingState(LoadingState.Fail)
			
			alert(error.message)
			console.error(error)
		}
	}
	
	return (
		<Modal
			className="create-section"
			isShowing={isShowing}
			setIsShowing={setIsShowing}
		>
			<div className="header">
				<h2 className="title">
					Create section
				</h2>
				<button
					className="hide"
					onClick={() => setIsShowing(false)}
				>
					<FontAwesomeIcon icon={faTimesCircle} />
				</button>
			</div>
			<div className="content">
				<label>Section name (eg. Advanced words)</label>
				<Input
					icon={faSignature}
					type="name"
					placeholder="Required"
					value={name}
					setValue={setName}
				/>
				<Button
					loaderSize="16px"
					loaderThickness="3px"
					loaderColor="white"
					loading={isLoading}
					disabled={isDisabled}
					onClick={create}
				>
					Create
				</Button>
			</div>
		</Modal>
	)
}
