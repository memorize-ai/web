import React, { useState } from 'react'

import Deck from '../../models/Deck'
import { getPopUpUrl } from '.'
import HorizontalScrollingList from './HorizontalScrollingList'
import Box from './Box'
import CreateDeckModal from './CreateDeckModal'

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
		<>
			<div className="flex mb-2">
				<h1 className="text-4xl text-white font-bold">
					Created decks
				</h1>
				<button
					className="uppercase"
					onClick={() => setIsCreateDeckModalShowing(true)}
				>
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
		</>
	)
}
