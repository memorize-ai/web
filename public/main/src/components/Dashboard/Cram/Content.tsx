import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'

import useCramState from './useCramState'
import Head from '../../shared/Head'
import Navbar from './Navbar'
import Sliders from './Sliders'
import CardContainer from './CardContainer'
import Footer from './Footer'
import ProgressModal from './ProgressModal'
import RecapModal from './RecapModal'

import '../../../scss/components/Dashboard/Cram.scss'

interface Params {
	slugId: string
	slug: string
	sectionId: string
}

const CramContent = () => {
	const { slugId, slug, sectionId } = useParams<Params>()
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
		progressData,
		isProgressModalShowing,
		setIsProgressModalShowing,
		recapData,
		isRecapModalShowing,
		setIsRecapModalShowing,
		showRecap,
		counts: { mastered, seen, unseen },
		currentSide,
		flip,
		skip,
		rate
	} = useCramState(slugId, slug, sectionId)
	
	const backUrl = useMemo(() => (
		`/decks/${slugId}/${slug}`
	), [slugId, slug])
	
	return (
		<div className="mask" onClick={waitForRating}>
			<Head
				title={
					`Cram${
						deck
							? ` | ${deck.name}`
							: ''
					} | memorize.ai`
				}
				description={
					`Cram${
						deck
							? ` ${deck.name}`
							: ''
					} on memorize.ai`
				}
				breadcrumbs={[]}
			/>
			<Navbar
				backUrl={backUrl}
				currentIndex={currentIndex}
				count={count}
				skip={skip}
				recap={showRecap}
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
			<ProgressModal
				data={progressData}
				isShowing={isProgressModalShowing}
				setIsShowing={setIsProgressModalShowing}
			/>
			<RecapModal
				data={recapData}
				backUrl={backUrl}
				isShowing={isRecapModalShowing}
				setIsShowing={setIsRecapModalShowing}
			/>
		</div>
	)
}

export default CramContent
