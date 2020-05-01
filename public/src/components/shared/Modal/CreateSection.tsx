import React, { useState, useEffect } from 'react'

import Deck from '../../../models/Deck'
import Section from '../../../models/Section'
import InputModal from './Input'
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
	
	useEffect(() => {
		if (isShowing)
			setName('')
	}, [isShowing])
	
	const create = () => {
		if (!sections)
			return
		
		Section.createForDeck(deck, name, sections.length)
			.catch(error => {
				alert(error.message)
				console.error(error)
			})
		
		setIsShowing(false)
	}
	
	return (
		<InputModal
			title="Create section"
			placeholder="Name"
			buttonText="Create"
			value={name}
			setValue={setName}
			onClick={create}
			isDisabled={!name}
			isShowing={isShowing}
			setIsShowing={setIsShowing}
		/>
	)
}
