import React, { MouseEvent } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faApple } from '@fortawesome/free-brands-svg-icons'

import Deck from '../../../models/Deck'
import Base from './Base'
import { randomEmoji } from '../../../utils'
import { APP_STORE_URL } from '../../../constants'

import '../../../scss/components/DeckCell/Owned.scss'

export default ({ deck }: { deck: Deck }) => {
	const { userData } = deck
	
	const numberOfDueCards = userData?.numberOfDueCards ?? 0
	const hasDueCards = Boolean(numberOfDueCards)
	
	const numberOfSections = Object.values(userData?.sections ?? {}).reduce((acc, count) => (
		acc + (count ? 1 : 0)
	), 0)
	
	const downloadApp = (event: MouseEvent) => {
		event.preventDefault()
		window.location.href = APP_STORE_URL
	}
	
	return (
		<Base className="owned" deck={deck} href={`/decks/${deck.slug}`}>
			<p className="due-cards-message">
				{hasDueCards
					? `${numberOfDueCards} card${numberOfDueCards === 1 ? '' : 's'} due in ${numberOfSections} section${numberOfSections === 1 ? '' : 's'}`
					: `${randomEmoji()} Woohoo! No cards due`
				}
			</p>
			{hasDueCards && (
				<button className="download-app" onClick={downloadApp}>
					<FontAwesomeIcon icon={faApple} />
					<p>Download app to review</p>
				</button>
			)}
		</Base>
	)
}
