import React, { memo } from 'react'

import Deck from '../../../models/Deck'
import Section from '../../../models/Section'
import Card from '../../../models/Card'
import LoadingState from '../../../models/LoadingState'
import CardSide from '../../shared/CardSide'
import Loader from '../../shared/Loader'

const CramCardContainer = (
	{ deck, section, card, loadingState }: {
		deck: Deck | null
		section: Section | null
		card: Card | null
		loadingState: LoadingState
	}
) => (
	<div className="card-container">
		<div className="location">
			{deck
				? <p className="deck">{deck.name}</p>
				: <Loader size="20px" thickness="4px" color="white" />
			}
			{section && (
				<>
					<div className="divider" />
					<p className="section">{section.name}</p>
				</>
			)}
		</div>
		{card && loadingState === LoadingState.Success
			? <CardSide className="card">{card.front}</CardSide>
			: (
				<div className="card loading">
					<Loader size="30px" thickness="5px" color="#582efe" />
				</div>
			)
		}
	</div>
)

export default memo(CramCardContainer)
