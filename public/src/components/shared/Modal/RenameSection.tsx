import React, { useState, useEffect, useCallback, memo } from 'react'

import Deck from '../../../models/Deck'
import Section from '../../../models/Section'
import InputModal from './Input'
import { handleError } from '../../../utils'

const RenameSectionModal = memo((
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
	}, [isShowing, section, setName])
	
	const rename = useCallback(() => {
		if (!section)
			return
		
		section.rename(deck, name)
			.catch(handleError)
		
		setIsShowing(false)
	}, [section, deck, name, setIsShowing])
	
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
})

export default RenameSectionModal
