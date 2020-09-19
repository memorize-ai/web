import React, { useCallback } from 'react'

import useDeckAndSection from './useDeckAndSection'
import useInlineState from './useInlineState'
import Navbar from './Navbar'
import Main from './Main'

import styles from '../../scss/components/Inline/index.module.scss'

const InlineContent = () => {
	const { deck, sectionId } = useDeckAndSection()
	const {
		card,
		loadingState,
		predictionLoadingState,
		isWaitingForRating,
		waitForRating,
		cardClassName,
		currentSide,
		currentIndex,
		count,
		flip,
		rate,
		progressData,
		isProgressShowing,
		setIsProgressShowing,
		recapData,
		isRecapShowing,
		setIsRecapShowing,
		showRecap
	} = useInlineState(deck, sectionId)
	
	const action = useCallback(() => {
		// TODO: Either log in or complete
	}, [])
	
	return (
		<div className={styles.root}>
			<Navbar deck={deck} action={action} />
			<Main
				deck={deck}
				card={card}
				cardLoadingState={loadingState}
				predictionLoadingState={predictionLoadingState}
				rate={rate}
			/>
		</div>
	)
}

export default InlineContent
