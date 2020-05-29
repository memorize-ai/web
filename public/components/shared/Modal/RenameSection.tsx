import React, { useState, useEffect } from 'react'

import Deck from 'models/Deck'
import Section from 'models/Section'
import InputModal from './Input'
import { handleError } from 'lib/utils'

export default (
	{ deck, section, isShowing, setIsShowing }: {
		deck: Deck
		section: Section | null
		isShowing: boolean
		setIsShowing: (isShowing: boolean) => void
	}
) => {
	const [name, setName] = useState('')
	
	useEffect(() => {
		if (isShowing && section)
			setName(section.name)
	}, [isShowing, section])
	
	const rename = () => {
		if (!section)
			return
		
		section.rename(deck, name)
			.catch(handleError)
		
		setIsShowing(false)
	}
	
	return (
		<InputModal
			title="Rename section"
			placeholder="Name"
			buttonText="Rename"
			value={name}
			setValue={setName}
			onClick={rename}
			isDisabled={!name}
			isShowing={isShowing}
			setIsShowing={setIsShowing}
		/>
	)
}
