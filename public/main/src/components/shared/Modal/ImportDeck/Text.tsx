import React, { useCallback, useState, ChangeEvent } from 'react'

import { ModalShowingProps } from '..'
import Modal from '.'

export interface ImportDeckTextModalCard {
	front: string
	back: string
}

export interface ImportDeckQuizletUrlModalProps extends ModalShowingProps {
	onSubmit: (cards: ImportDeckTextModalCard[]) => void
}

const ImportDeckQuizletUrlModal = ({
	onSubmit: _onSubmit,
	isShowing,
	setIsShowing
}: ImportDeckQuizletUrlModalProps) => {
	const [text, setText] = useState('')
	const [cardDelimiter, setCardDelimiter] = useState('\n')
	const [sideDelimiter, setSideDelimiter] = useState('\t')
	
	const onSubmit = useCallback(async () => {
		try {
			_onSubmit(
				text
					.split(cardDelimiter)
					.reduce((acc, text) => {
						const [front, back] = text.split(sideDelimiter)
						
						return front && back
							? [...acc, { front, back }]
							: acc
					}, [] as ImportDeckTextModalCard[])
			)
		} catch (error) {
			console.log(error)
		}
	}, [text, cardDelimiter, sideDelimiter, _onSubmit])
	
	const onTextInputChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>) => {
		setText(event.target.value)
	}, [setText])
	
	return (
		<Modal
			title="Import from Quizlet"
			onSubmit={onSubmit}
			isShowing={isShowing}
			setIsShowing={setIsShowing}
		>
			<textarea
				placeholder="Quizlet set URL"
				value={text}
				onChange={onTextInputChange}
			/>
		</Modal>
	)
}

export default ImportDeckQuizletUrlModal
