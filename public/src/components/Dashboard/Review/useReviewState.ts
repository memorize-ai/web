import { useRef, useMemo, useCallback } from 'react'
import { useHistory } from 'react-router-dom'

import Section from '../../../models/Section'
import Card from '../../../models/Card'
import LoadingState from '../../../models/LoadingState'
import PerformanceRating from '../../../models/PerformanceRating'
import useCurrentUser from '../../../hooks/useCurrentUser'
import useDecks from '../../../hooks/useDecks'

export interface ReviewCard {
	value: Card
	snapshot: firebase.firestore.DocumentSnapshot
	ratings: PerformanceRating[]
	isNew: boolean
}

export interface ReviewProgressData {
	xp: number
	streak: number
	emoji: string
	message: string
}

export interface ReviewRecapData {
	start: Date
	xpGained: number
	masteredCount: number
	totalCount: number
	easiestSection: Section | null
	hardestSection: Section | null
	isSameSection: boolean
}

export interface ReviewPredictions {
	[PerformanceRating.Easy]: Date
	[PerformanceRating.Struggled]: Date
	[PerformanceRating.Forgot]: Date
}

export const REVIEW_MASTERED_STREAK = 6

export default (
	slugId: string | undefined,
	slug: string | undefined,
	_sectionId: string | undefined
) => {
	const start = useRef(new Date())
	const xpGained = useRef(0)
	
	const sectionId = useMemo(() => (
		_sectionId === 'unsectioned' ? '' : _sectionId
	), [_sectionId])
	
	console.log(start, xpGained, sectionId)
	
	const history = useHistory()
	const [currentUser, currentUserLoadingState] = useCurrentUser()
	
	const [decks, decksLoadingState] = useDecks()
	
	const goToDeckPage = useCallback(() => {
		history.push(`/d/${slugId}/${slug}`)
	}, [history, slugId, slug])
	
	const deck = useMemo(() => {
		if (currentUser === null && currentUserLoadingState === LoadingState.Success) {
			goToDeckPage()
			return null
		}
		
		if (decksLoadingState !== LoadingState.Success)
			return null
		
		const deck = decks.find(deck => deck.slugId === slugId)
		
		if (deck)
			return deck
		
		goToDeckPage()
		return null
	}, [currentUser, currentUserLoadingState, decksLoadingState, decks, slugId, goToDeckPage])
	
	return {
		deck,
		section: null as Section | null,
		card: null as ReviewCard | null,
		loadingState: LoadingState.Loading,
		isWaitingForRating: false,
		waitForRating: () => undefined,
		cardClassName: undefined,
		currentSide: 'front' as 'front' | 'back',
		currentIndex: 0,
		predictions: null as ReviewPredictions | null,
		count: 0 as number | null,
		flip: () => undefined,
		rate: (rating: PerformanceRating) => console.log(rating),
		progressData: null as ReviewProgressData | null,
		isProgressModalShowing: false,
		setIsProgressModalShowing: (isShowing: boolean) => console.log(isShowing),
		recapData: null as ReviewRecapData | null,
		isRecapModalShowing: false,
		setIsRecapModalShowing: (isShowing: boolean) => console.log(isShowing),
		showRecap: () => undefined
	}
}
