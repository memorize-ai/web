import React, { useState, useCallback } from 'react'

import Deck from '../../../models/Deck'
import Section from '../../../models/Section'
import LoadingState from '../../../models/LoadingState'
import Modal from '../../shared/Modal'
import Button from '../../shared/Button'
import useSections from '../../../hooks/useSections'

import { ReactComponent as TimesIcon } from '../../../images/icons/times.svg'

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
			
			setName('')
			setIsShowing(false)
		} catch (error) {
			setLoadingState(LoadingState.Fail)
			
			alert(error.message)
			console.error(error)
		}
	}
	
	const onNameInputRef = useCallback((input: HTMLInputElement | null) => {
		input && input[isShowing ? 'focus' : 'blur']()
	}, [isShowing])
	
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
					<TimesIcon />
				</button>
			</div>
			<div className="content">
				<input
					ref={onNameInputRef}
					placeholder="Name"
					value={name}
					onChange={({ target }) => setName(target.value)}
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
