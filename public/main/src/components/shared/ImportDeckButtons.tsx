import React, { memo, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileAlt, faLink } from '@fortawesome/free-solid-svg-icons'

import '../../scss/components/ImportDeckButtons.scss'

const ImportDeckButtons = () => {
	const [isPasteTextModalShowing, setIsPasteTextModalShowing] = useState(false)
	const [isPasteQuizletUrlModalShowing, setIsPasteQuizletUrlModalShowing] = useState(false)
	
	return (
		<div className="import-deck-buttons">
			<button onClick={() => setIsPasteTextModalShowing(true)}>
				<FontAwesomeIcon icon={faFileAlt} />
				<p>Import</p>
			</button>
			<button onClick={() => setIsPasteQuizletUrlModalShowing(true)}>
				<FontAwesomeIcon icon={faLink} />
				<p>Import from Quizlet</p>
			</button>
		</div>
	)
}

export default memo(ImportDeckButtons)
