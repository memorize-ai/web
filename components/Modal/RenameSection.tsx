import { useState, useEffect, useCallback } from 'react'

import { ModalShowingProps } from '.'
import Deck from 'models/Deck'
import Section from 'models/Section'
import InputModal from './Input'
import { handleError } from 'lib/utils'

const RenameSectionModal = ({
	deck,
	section,
	isShowing,
	setIsShowing
}: {
	deck: Deck
	section: Section | null
} & ModalShowingProps) => {
	const [name, setName] = useState('')

	useEffect(() => {
		if (isShowing && section) setName(section.name)
	}, [isShowing, section, setName])

	const rename = useCallback(() => {
		if (!section) return

		section.rename(deck, name).catch(handleError)

		setIsShowing(false)
	}, [section, deck, name, setIsShowing])

	return (
		<InputModal
			title="Rename section"
			placeholder="Name"
			buttonText="Rename"
			value={name}
			setValue={setName}
			onSubmit={rename}
			isDisabled={!name}
			isShowing={isShowing}
			setIsShowing={setIsShowing}
		/>
	)
}

export default RenameSectionModal
