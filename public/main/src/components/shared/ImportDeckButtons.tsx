import React, { useState, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileAlt, faLink } from '@fortawesome/free-solid-svg-icons'

import TextModal, { ImportDeckTextModalCard } from './Modal/ImportDeck/Text'
import QuizletUrlModal, { ImportDeckQuizletUrlModalData } from './Modal/ImportDeck/QuizletUrl'

import '../../scss/components/ImportDeckButtons.scss'

const ImportDeckButtons = () => {
	const [isTextModalShowing, setIsTextModalShowing] = useState(false)
	const [isQuizletUrlModalShowing, setIsQuizletUrlModalShowing] = useState(false)
	
	const onTextSubmit = useCallback((cards: ImportDeckTextModalCard[]) => {
		console.log(cards)
	}, [])
	
	const onQuizletUrlSubmit = useCallback((data: ImportDeckQuizletUrlModalData) => {
		console.log(data)
	}, [])
	
	return (
		<div className="import-deck-buttons">
			<button onClick={() => setIsTextModalShowing(true)}>
				<FontAwesomeIcon icon={faFileAlt} />
				<p>Import</p>
			</button>
			<button onClick={() => setIsQuizletUrlModalShowing(true)}>
				<FontAwesomeIcon icon={faLink} />
				<p>Import from Quizlet</p>
			</button>
			<TextModal
				onSubmit={onTextSubmit}
				isShowing={isTextModalShowing}
				setIsShowing={setIsTextModalShowing}
			/>
			<QuizletUrlModal
				onSubmit={onQuizletUrlSubmit}
				isShowing={isQuizletUrlModalShowing}
				setIsShowing={setIsQuizletUrlModalShowing}
			/>
		</div>
	)
}

export default ImportDeckButtons
