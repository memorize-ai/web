import React, { useState, useCallback } from 'react'

import Deck from '../../../models/Deck'
import Section from '../../../models/Section'
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
	
	const create = () => {
		Section.createForDeck(deck, name, sections.length)
			.catch(error => {
				alert(error.message)
				console.error(error)
			})
		
		setIsShowing(false)
	}
	
	const onNameInputRef = useCallback((input: HTMLInputElement | null) => {
		input && input[isShowing ? 'focus' : 'blur']()
		
		if (isShowing)
			setName('')
	}, [isShowing])
	
	return (
		<Modal
			className="create-section"
			isLazy={true}
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
					disabled={!name}
					onClick={create}
				>
					Create
				</Button>
			</div>
		</Modal>
	)
}
