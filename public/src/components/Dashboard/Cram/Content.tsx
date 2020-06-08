import React, { memo } from 'react'
import { useParams } from 'react-router-dom'

import useCramState from './useCramState'
import Navbar from './Navbar'
import Sliders from './Sliders'
import CardContainer from './CardContainer'
import Footer from './Footer'
import ProgressModal from './ProgressModal'

import '../../../scss/components/Dashboard/Cram.scss'

const CramContent = () => {
	const { slugId, slug, sectionId } = useParams()
	const {
		deck,
		section,
		card,
		currentIndex,
		count,
		loadingState,
		isWaitingForRating,
		waitForRating,
		cardClassName,
		shouldShowRecap,
		counts: { mastered, seen, unseen },
		currentSide,
		flip,
		skip,
		rate
	} = useCramState(slugId, slug, sectionId)
	
	return (
		<div className="mask" onClick={waitForRating}>
			<Navbar
				backUrl={`/decks/${slugId}/${slug}`}
				currentIndex={currentIndex}
				count={count}
				skip={skip}
				recap={() => undefined}
			/>
			<Sliders
				mastered={mastered}
				seen={seen}
				unseen={unseen}
				total={count ?? 0}
			/>
			<CardContainer
				deck={deck}
				section={section}
				card={card}
				loadingState={loadingState}
				isWaitingForRating={isWaitingForRating}
				cardClassName={cardClassName}
				currentSide={currentSide}
				flip={flip}
			/>
			<Footer
				isWaitingForRating={isWaitingForRating}
				rate={rate}
			/>
		</div>
	)
}

export default memo(CramContent)
