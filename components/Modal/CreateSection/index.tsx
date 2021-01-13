import { useState, useEffect, useCallback } from 'react'

import Deck from 'models/Deck'
import Section from 'models/Section'
import InputModal from '../Input'
import useSections from 'hooks/useSections'
import handleError from 'lib/handleError'
import { ModalShowingProps } from '..'

export interface CreateSectionModalProps extends ModalShowingProps {
	deck: Deck
}

const CreateSectionModal = ({
	deck,
	isShowing,
	setIsShowing
}: CreateSectionModalProps) => {
	const sections = useSections(deck.id)
	const [name, setName] = useState('')

	useEffect(() => {
		if (isShowing) setName('')
	}, [isShowing, setName])

	const create = useCallback(() => {
		if (!sections) return

		Section.createForDeck(deck, name, sections.length).catch(handleError)

		setIsShowing(false)
	}, [sections, deck, name, setIsShowing])

	return (
		<InputModal
			title="Create section"
			placeholder="Name"
			buttonText="Create"
			value={name}
			setValue={setName}
			onSubmit={create}
			isDisabled={!name}
			isShowing={isShowing}
			setIsShowing={setIsShowing}
		/>
	)
}

export default CreateSectionModal
