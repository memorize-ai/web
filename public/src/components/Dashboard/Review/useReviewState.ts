import { useRef, useMemo, useCallback, useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import firebase from '../../../firebase'
import Deck from '../../../models/Deck'
import Section from '../../../models/Section'
import Card from '../../../models/Card'
import LoadingState from '../../../models/LoadingState'
import PerformanceRating from '../../../models/PerformanceRating'
import useCurrentUser from '../../../hooks/useCurrentUser'
import useDecks from '../../../hooks/useDecks'
import useSections from '../../../hooks/useSections'

import 'firebase/firestore'
import 'firebase/functions'

export interface ReviewCard {
	value: Card
	section: Section
	snapshot: firebase.firestore.DocumentSnapshot
	rating: PerformanceRating | null
	predictions: ReviewPredictions | null
	streak: number
	isNew: boolean
	isNewlyMastered: boolean | null
}

export interface ReviewProgressData {
	xp: number
	streak: number
	next: Date
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

const firestore = firebase.firestore()
const functions = firebase.functions()

const reviewCard = functions.httpsCallable('reviewCard')
const getCardPrediction = functions.httpsCallable('getCardPrediction')

export default (
	slugId: string | undefined,
	slug: string | undefined,
	_sectionId: string | undefined
) => {
	const start = useRef(new Date())
	const startOfCurrentCard = useRef(new Date())
	
	const xpGained = useRef(0)
	
	const sectionId = useMemo(() => (
		_sectionId === 'unsectioned' ? '' : _sectionId
	), [_sectionId])
	
	const history = useHistory()
	const [currentUser, currentUserLoadingState] = useCurrentUser()
	
	const [decks, decksLoadingState] = useDecks()
	
	const isReviewingAllDecks = useMemo(() => (
		!(slugId && slug)
	), [slugId, slug])
	
	const goToDeckPage = useCallback(() => {
		history.push(`/d/${slugId}/${slug}`)
	}, [history, slugId, slug])
	
	const _deck = useMemo(() => {
		if (isReviewingAllDecks)
			return null
		
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
	}, [isReviewingAllDecks, currentUser, currentUserLoadingState, decksLoadingState, decks, slugId, goToDeckPage])
	
	const [deck, setDeck] = useState(null as Deck | null)
	const [card, setCard] = useState(null as ReviewCard | null)
	
	const _sections = useSections(deck?.id)
	const sections = useMemo(() => (
		deck && _sections && [
			deck.unsectionedSection,
			..._sections
		]
	), [deck, _sections])
	
	const [currentSide, setCurrentSide] = useState('front' as 'front' | 'back')
	const [count, setCount] = useState(null as number | null)
	
	const showRecap = useCallback((flag: boolean = true) => {
		if (!flag)
			return
		
		// TODO: Show recap
	}, [])
	
	/** @returns If the recap should be shown or not */
	const next = useCallback(async () => {
		if (isReviewingAllDecks) {
			// === Reviewing all decks ===
			
			return true
		}
		
		if (sectionId === undefined) {
			// === Reviewing single deck ===
			
			return true
		}
		
		// === Reviewing single section ===
		
		return true
	}, [isReviewingAllDecks, sectionId])
	
	const rate = useCallback(async (rating: PerformanceRating) => {
		if (!(deck && card))
			return
		
		await reviewCard({
			deck: deck.id,
			section: card.section.id,
			card: card.value.id,
			rating,
			viewTime: Date.now() - startOfCurrentCard.current.getTime()
		})
	}, [deck, card])
	
	useEffect(() => {
		setDeck(_deck)
	}, [_deck, setDeck])
	
	useEffect(() => {
		// Reviewing all decks
		if (isReviewingAllDecks) {
			if (decksLoadingState === LoadingState.Success)
				setCount(decks.reduce((acc, { userData }) => (
					acc + (userData?.numberOfDueCards ?? 0)
				), 0))
			
			if (count === null)
				next().then(showRecap)
			
			return
		}
		
		// Reviewing single deck
		if (sectionId === undefined)
			if (deck && sections) {
				setCount(sections.reduce((acc, section) => (
					acc + deck.numberOfCardsDueForSection(section)
				), 0))
			
			if (count === null)
				next().then(showRecap)
			
			return
		}
		
		// Reviewing single section
		if (sections) {
			const section = sections.find(section => section.id === sectionId)
			
			if (deck && section)
				setCount(deck.numberOfCardsDueForSection(section))
			
			if (count === null)
				next().then(showRecap)
		}
	}, [count, isReviewingAllDecks, decksLoadingState, setCount, decks, next, showRecap, sectionId, deck, sections])
	
	return {
		deck,
		card,
		loadingState: LoadingState.Loading,
		isWaitingForRating: false,
		waitForRating: () => undefined,
		cardClassName: undefined,
		currentSide,
		currentIndex: 0,
		count: 0 as number | null,
		flip: () => undefined,
		rate,
		progressData: null as ReviewProgressData | null,
		isProgressModalShowing: false,
		setIsProgressModalShowing: (isShowing: boolean) => console.log(isShowing),
		recapData: null as ReviewRecapData | null,
		isRecapModalShowing: false,
		setIsRecapModalShowing: (isShowing: boolean) => console.log(isShowing),
		showRecap: () => undefined
	}
}
