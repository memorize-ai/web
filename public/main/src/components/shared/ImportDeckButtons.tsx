import React, { memo, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileAlt, faLink } from '@fortawesome/free-solid-svg-icons'

import TextModal from './Modal/ImportDeck/Text'
import QuizletUrlModal from './Modal/ImportDeck/QuizletUrl'

import '../../scss/components/ImportDeckButtons.scss'

const ImportDeckButtons = () => {
	const [isTextModalShowing, setIsTextModalShowing] = useState(false)
	const [isQuizletUrlModalShowing, setIsQuizletUrlModalShowing] = useState(false)
	
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
				isShowing={isTextModalShowing}
				setIsShowing={setIsTextModalShowing}
			/>
			<QuizletUrlModal
				isShowing={isQuizletUrlModalShowing}
				setIsShowing={setIsQuizletUrlModalShowing}
			/>
		</div>
	)
}

export default ImportDeckButtons
