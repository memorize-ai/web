import { useRef, useMemo, useCallback, useState, useEffect, MutableRefObject } from 'react'
import { useHistory } from 'react-router-dom'

import firebase from '../../../firebase'
import User from '../../../models/User'
import Deck from '../../../models/Deck'
import Section from '../../../models/Section'
import Card from '../../../models/Card'
import LoadingState from '../../../models/LoadingState'
import PerformanceRating from '../../../models/PerformanceRating'
import useCurrentUser from '../../../hooks/useCurrentUser'
import useDecks from '../../../hooks/useDecks'
import useSections from '../../../hooks/useSections'
import { sleep } from '../../../utils'

import 'firebase/firestore'
import 'firebase/functions'

export interface ReviewCard {
	value: Card
	section: Section
	rating: PerformanceRating | null
	prediction: ReviewPrediction | null
	streak: number
	isNew: boolean
	isNewlyMastered: boolean | null
}

export interface ReviewProgressData {
	xp: number
	streak: number
	next: Date | null
	didNewlyMaster: boolean
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

export interface ReviewPrediction {
	[PerformanceRating.Easy]: Date
	[PerformanceRating.Struggled]: Date
	[PerformanceRating.Forgot]: Date
}


export const REVIEW_MASTERED_STREAK = 6

const SHIFT_ANIMATION_DURATION = 400
const PROGRESS_MODAL_SHOW_DURATION = 1000
const XP_CHANCE = 0.4

const firestore = firebase.firestore()
const functions = firebase.functions()

const reviewCard = functions.httpsCallable('reviewCard')
const getCardPrediction = functions.httpsCallable('getCardPrediction')

export const gainXpWithChance = (user: User, ref: MutableRefObject<number>) => {
	if (Math.random() > XP_CHANCE)
		return 0
	
	firestore.doc(`users/${user.id}`).update({
		xp: firebase.firestore.FieldValue.increment(1)
	})
	
	ref.current++
	
	return 1
}

export const getProgressDataForRating = (rating: PerformanceRating) => {
	switch (rating) {
		case PerformanceRating.Easy:
			return {
				emoji: '🥳',
				message: 'You\'re doing great!'
			}
		case PerformanceRating.Struggled:
			return {
				emoji: '🧐',
				message: 'You\'ll see this again soon!'
			}
		case PerformanceRating.Forgot:
			return {
				emoji: '🤕',
				message: 'Better luck next time!'
			}
	}
}

export default (
	slugId: string | undefined,
	slug: string | undefined,
	_sectionId: string | undefined
) => {
	const start = useRef(new Date())
	const startOfCurrentCard = useRef(new Date())
	
	const xpGained = useRef(0)
	const isReviewingNewCards = useRef(false)
	
	const isWaitingForInit = useRef(null as boolean | null) // null is initial
	const shouldIncrementCurrentIndex = useRef(true)
	
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
	
	const goBack = useCallback(() => {
		history.push(`/decks/${slugId}/${slug}`)
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
	
	const [count, setCount] = useState(null as number | null)
	
	const [currentDeckIndex, setCurrentDeckIndex] = useState(0)
	const [currentIndex, setCurrentIndex] = useState(-1) // Incremented beforehand, 
	
	const [loadingState, setLoadingState] = useState(LoadingState.Loading)
	const [predictionLoadingState, setPredictionLoadingState] = useState(LoadingState.Loading)
	
	const [cards, setCards] = useState([] as ReviewCard[])
	
	const [currentSide, setCurrentSide] = useState('front' as 'front' | 'back')
	const [isWaitingForRating, setIsWaitingForRating] = useState(false)
	const [cardClassName, setCardClassName] = useState(undefined as string | undefined)
	
	const [isProgressModalShowing, setIsProgressModalShowing] = useState(false)
	const [progressData, _setProgressData] = useState(null as ReviewProgressData | null)
	
	const [isRecapModalShowing, _setIsRecapModalShowing] = useState(false)
	const [recapData, setRecapData] = useState(null as ReviewRecapData | null)
	
	const setProgressData = useCallback(async (data: ReviewProgressData) => {
		_setProgressData(data)
		setIsProgressModalShowing(true)
		
		await sleep(PROGRESS_MODAL_SHOW_DURATION)
		
		setIsProgressModalShowing(false)
	}, [_setProgressData, setIsProgressModalShowing])
	
	const setIsRecapModalShowing = useCallback((isShowing: boolean) => {
		isShowing
			? _setIsRecapModalShowing(true)
			: goBack()
	}, [_setIsRecapModalShowing, goBack])
	
	const showRecap = useCallback((flag: boolean = true) => {
		if (!flag)
			return
		
		// TODO: Show recap
		console.log('Recap')
	}, [])
	
	const incrementCurrentIndex = useCallback(() => {
		setCurrentIndex(currentIndex => {
			const newIndex = currentIndex + 1
			
			if (newIndex === count)
				setCount(count => (count ?? 0) + 1)
			
			return newIndex
		})
	}, [setCurrentIndex, count, setCount])
	
	const getCard = useCallback(async (deckId: string, cardId: string) => (
		Card.fromSnapshot(
			await firestore.doc(`decks/${deckId}/cards/${cardId}`).get(),
			null
		)
	), [])
	
	/** @returns If the recap should be shown or not */
	const next = useCallback(async (): Promise<boolean> => {
		if (!currentUser)
			return true
		
		if (shouldIncrementCurrentIndex.current)
			incrementCurrentIndex()
		
		shouldIncrementCurrentIndex.current = true
		
		if (isReviewingAllDecks) {
			// === Reviewing all decks ===
			
			if (!(deck && sections))
				return true
			
			setLoadingState(LoadingState.Loading)
			
			if (isReviewingNewCards.current) {
				const { docs } = await firestore
					.collection(`users/${currentUser.id}/decks/${deck.id}/cards`)
					.where('new', '==', true)
					.limit(1)
					.get()
				
				const snapshot = docs[0]
				
				if (!snapshot) {
					setCurrentDeckIndex(index => index + 1)
					shouldIncrementCurrentIndex.current = false
					
					return false
				}
				
				const newCardValue = await getCard(deck.id, snapshot.id)
				
				const section = sections.find(({ id }) =>
					id === newCardValue.sectionId
				)
				
				if (!section) {
					setLoadingState(LoadingState.Success)
					return true
				}
				
				const newCard: ReviewCard = {
					value: newCardValue,
					section,
					rating: null,
					prediction: null,
					streak: 0,
					isNew: true,
					isNewlyMastered: null
				}
				
				setCards(cards => [...cards, newCard])
				setCard(newCard)
				setLoadingState(LoadingState.Success)
				
				return false
			}
			
			const { docs } = await firestore
				.collection(`users/${currentUser.id}/decks/${deck.id}/cards`)
				.where('new', '==', false)
				.where('due', '<=', new Date())
				.orderBy('due')
				.limit(1)
				.get()
			
			const snapshot = docs[0]
			
			if (!snapshot) {
				isReviewingNewCards.current = true
				shouldIncrementCurrentIndex.current = false
				
				return next()
			}
			
			const newCardValue = await getCard(deck.id, snapshot.id)
			
			const section = sections.find(({ id }) =>
				id === newCardValue.sectionId
			)
			
			if (!section) {
				setLoadingState(LoadingState.Success)
				return true
			}
			
			const newCard: ReviewCard = {
				value: newCardValue,
				section,
				rating: null,
				prediction: null,
				streak: snapshot.get('streak') ?? 0,
				isNew: false,
				isNewlyMastered: null
			}
			
			setCards(cards => [...cards, newCard])
			setCard(newCard)
			setLoadingState(LoadingState.Success)
			
			return false
		}
		
		if (sectionId === undefined) {
			// === Reviewing single deck ===
			
			if (!(deck && sections))
				return true
			
			setLoadingState(LoadingState.Loading)
			
			if (isReviewingNewCards.current) {
				const { docs } = await firestore
					.collection(`users/${currentUser.id}/decks/${deck.id}/cards`)
					.where('new', '==', true)
					.limit(1)
					.get()
				
				const snapshot = docs[0]
				
				if (!snapshot) {
					setLoadingState(LoadingState.Success)
					return true
				}
				
				const newCardValue = await getCard(deck.id, snapshot.id)
				
				const section = sections.find(({ id }) =>
					id === newCardValue.sectionId
				)
				
				if (!section) {
					setLoadingState(LoadingState.Success)
					return true
				}
				
				const newCard: ReviewCard = {
					value: newCardValue,
					section,
					rating: null,
					prediction: null,
					streak: 0,
					isNew: true,
					isNewlyMastered: null
				}
				
				setCards(cards => [...cards, newCard])
				setCard(newCard)
				setLoadingState(LoadingState.Success)
				
				return false
			}
			
			const { docs } = await firestore
				.collection(`users/${currentUser.id}/decks/${deck.id}/cards`)
				.where('new', '==', false)
				.where('due', '<=', new Date())
				.orderBy('due')
				.limit(1)
				.get()
			
			const snapshot = docs[0]
			
			if (!snapshot) {
				isReviewingNewCards.current = true
				shouldIncrementCurrentIndex.current = false
				
				return next()
			}
			
			const newCardValue = await getCard(deck.id, snapshot.id)
			
			const section = sections.find(({ id }) =>
				id === newCardValue.sectionId
			)
			
			if (!section) {
				setLoadingState(LoadingState.Success)
				return true
			}
			
			const newCard: ReviewCard = {
				value: newCardValue,
				section,
				rating: null,
				prediction: null,
				streak: snapshot.get('streak') ?? 0,
				isNew: false,
				isNewlyMastered: null
			}
			
			setCards(cards => [...cards, newCard])
			setCard(newCard)
			setLoadingState(LoadingState.Success)
			
			return false
		}
		
		// === Reviewing single section ===
		
		if (!deck)
			return true
		
		const section = card?.section ?? (
			sections?.find(section => section.id === sectionId)
		)
		
		if (!section)
			return true
		
		setLoadingState(LoadingState.Loading)
		
		if (isReviewingNewCards.current) {
			const { docs } = await firestore
				.collection(`users/${currentUser.id}/decks/${deck.id}/cards`)
				.where('section', '==', section.id)
				.where('new', '==', true)
				.limit(1)
				.get()
			
			const snapshot = docs[0]
			
			if (!snapshot) {
				setLoadingState(LoadingState.Success)
				return true
			}
			
			const newCard: ReviewCard = {
				value: await getCard(deck.id, snapshot.id),
				section,
				rating: null,
				prediction: null,
				streak: 0,
				isNew: true,
				isNewlyMastered: null
			}
			
			setCards(cards => [...cards, newCard])
			setCard(newCard)
			setLoadingState(LoadingState.Success)
			
			return false
		}
		
		const { docs } = await firestore
			.collection(`users/${currentUser.id}/decks/${deck.id}/cards`)
			.where('section', '==', section.id)
			.where('new', '==', false)
			.where('due', '<=', new Date())
			.orderBy('due')
			.limit(1)
			.get()
		
		const snapshot = docs[0]
		
		if (!snapshot) {
			isReviewingNewCards.current = true
			shouldIncrementCurrentIndex.current = false
			
			return next()
		}
		
		const newCard: ReviewCard = {
			value: await getCard(deck.id, snapshot.id),
			section,
			rating: null,
			prediction: null,
			streak: snapshot.get('streak') ?? 0,
			isNew: false,
			isNewlyMastered: null
		}
		
		setCards(cards => [...cards, newCard])
		setCard(newCard)
		setLoadingState(LoadingState.Success)
		
		return false
	}, [currentUser, incrementCurrentIndex, setCurrentDeckIndex, isReviewingAllDecks, sectionId, deck, card, sections, getCard, setLoadingState, setCards, setCard])
	
	const transitionNext = useCallback(async () => {
		setCardClassName('shift')
		
		await sleep(SHIFT_ANIMATION_DURATION / 2)
		
		setCurrentSide('front')
		next().then(showRecap)
		
		await sleep(SHIFT_ANIMATION_DURATION / 2)
		
		setCardClassName(undefined)
	}, [setCardClassName, setCurrentSide, next, showRecap])
	
	const rate = useCallback(async (rating: PerformanceRating) => {
		if (!(deck && card && currentUser))
			return showRecap()
		
		const streak = card.streak + (rating > 0 ? 1 : 0)
		
		setIsWaitingForRating(false)
		setProgressData({
			xp: gainXpWithChance(currentUser, xpGained),
			streak,
			next: card.prediction && card.prediction[rating],
			didNewlyMaster: streak === REVIEW_MASTERED_STREAK,
			...getProgressDataForRating(rating)
		})
		
		setLoadingState(LoadingState.Loading)
		
		card.streak = streak
		card.isNewlyMastered = (
			await reviewCard({
				deck: deck.id,
				section: card.section.id,
				card: card.value.id,
				rating,
				viewTime: Date.now() - startOfCurrentCard.current.getTime()
			})
		).data
		
		transitionNext()
	}, [deck, card, setIsWaitingForRating, currentUser, showRecap, transitionNext, setProgressData, setLoadingState])
	
	const flip = useCallback(() => {
		setCurrentSide(side =>
			side === 'front' ? 'back' : 'front'
		)
	}, [setCurrentSide])
	
	const waitForRating = useCallback(async () => {
		if (isWaitingForRating || isProgressModalShowing || isRecapModalShowing || loadingState !== LoadingState.Success)
			return
		
		setIsWaitingForRating(true)
		setCurrentSide('back')
	}, [isWaitingForRating, isProgressModalShowing, isRecapModalShowing, loadingState, setIsWaitingForRating, setCurrentSide])
	
	const waitForInit = useCallback(() => {
		isWaitingForInit.current = isWaitingForInit.current ?? true
	}, [])
	
	useEffect(() => {
		if (_deck)
			setDeck(_deck)
	}, [_deck, setDeck])
	
	useEffect(() => {
		if (!(deck && card && loadingState === LoadingState.Success))
			return
		
		setPredictionLoadingState(LoadingState.Loading)
		
		getCardPrediction({
			deck: deck.id,
			card: card.value.id,
		}).then(({ data }) => {
			card.prediction = {
				[PerformanceRating.Easy]: new Date(data[PerformanceRating.Easy]),
				[PerformanceRating.Struggled]: new Date(data[PerformanceRating.Struggled]),
				[PerformanceRating.Forgot]: new Date(data[PerformanceRating.Forgot])
			}
			
			setPredictionLoadingState(LoadingState.Success)
		}).catch(error => {
			alert(error.message)
			setPredictionLoadingState(LoadingState.Fail)
		})
	}, [deck, card, loadingState, setPredictionLoadingState])
	
	useEffect(() => {
		if (!(isReviewingAllDecks && decksLoadingState === LoadingState.Success))
			return
		
		const newDeck = decks[currentDeckIndex]
		
		if (newDeck) {
			if (newDeck === deck)
				return // Don't unnecessarily initialize
			
			// Reset the new cards flag for the next deck
			isReviewingNewCards.current = false
			
			isWaitingForInit.current = true
			
			// This will trigger the useEffect that calls next
			setDeck(newDeck)
			
			return
		}
		
		// Couldn't find the next deck. Only thing left to do is show the recap.
		showRecap()
	}, [isReviewingAllDecks, decksLoadingState, decks, currentDeckIndex, deck, setDeck, showRecap])
	
	useEffect(() => {
		if (loadingState !== LoadingState.Success)
			return
		
		startOfCurrentCard.current = new Date()
		setCurrentSide('front')
	}, [loadingState, setCurrentSide])
	
	useEffect(() => {
		if (isReviewingAllDecks) {
			if (decksLoadingState === LoadingState.Success && count === null) {
				setCount(decks.reduce((acc, { userData }) => (
					acc + (userData?.numberOfDueCards ?? 0)
				), 0))
				waitForInit()
			}
		} else if (sectionId === undefined) {
			if (deck && sections && count === null) {
				setCount(sections.reduce((acc, section) => (
					acc + deck.numberOfCardsDueForSection(section)
				), 0))
				waitForInit()
			}
		} else if (sections) {
			const section = sections.find(section => section.id === sectionId)
			
			if (deck && section && count === null) {
				setCount(deck.numberOfCardsDueForSection(section))
				waitForInit()
			}
		}
		
		if (isWaitingForInit.current && currentUser && deck && sections) {
			next().then(showRecap)
			isWaitingForInit.current = false
		}
	}, [currentUser, count, isReviewingAllDecks, decksLoadingState, setCount, waitForInit, decks, next, showRecap, sectionId, deck, sections])
	
	return {
		deck,
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
		isProgressModalShowing,
		setIsProgressModalShowing,
		recapData,
		isRecapModalShowing,
		setIsRecapModalShowing,
		showRecap
	}
}
