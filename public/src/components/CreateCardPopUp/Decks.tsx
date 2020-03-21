import React, { useState } from 'react'

import Deck from '../../models/Deck'
import { getPopUpUrl } from './Content'
import HorizontalScrollingList from './HorizontalScrollingList'
import Box from './Box'
import CreateDeckModal from './CreateDeckModal'

import '../../scss/components/CreateCardPopUp/Decks.scss'

export default (
	{ decks, currentDeck, text, from }: {
		decks: Deck[]
		currentDeck: Deck | undefined
		text: string
		from: string
	}
) => {
	const [isCreateDeckModalShowing, setIsCreateDeckModalShowing] = useState(false)
	
	return (
		<div className="create-card-pop-up decks">
			<div className="header">
				<h1>Created decks</h1>
				<button onClick={() => setIsCreateDeckModalShowing(true)}>
					Create deck
				</button>
			</div>
			<HorizontalScrollingList>
				{decks.map(deck => (
					<Box
						key={deck.id}
						href={getPopUpUrl({ deck, text, from })}
						isSelected={deck.id === currentDeck?.id}
					>
						{deck.name}
					</Box>
				))}
			</HorizontalScrollingList>
			<CreateDeckModal
				isShowing={isCreateDeckModalShowing}
				hide={() => setIsCreateDeckModalShowing(false)}
			/>
		</div>
	)
}
