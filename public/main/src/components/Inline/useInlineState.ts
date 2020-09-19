import { useRef, useCallback, useState, useEffect, MutableRefObject, SetStateAction } from 'react'

import firebase from '../../firebase'
import User from '../../models/User'
import Deck from '../../models/Deck'
import Card from '../../models/Card'
import LoadingState from '../../models/LoadingState'
import PerformanceRating from '../../models/PerformanceRating'
import useCurrentUser from '../../hooks/useCurrentUser'
import { sleep, handleError } from '../../utils'
import { Progress, Recap, _Card } from './models'

import 'firebase/firestore'
import 'firebase/functions'

export const MASTERED_STREAK = 6

const SHIFT_ANIMATION_DURATION = 400
const FLIP_ANIMATION_DURATION = 300
const PROGRESS_SHOW_DURATION = 1000
const XP_CHANCE = 0.4

const firestore = firebase.firestore()
const functions = firebase.functions()

const reviewCard = functions.httpsCallable('reviewCard')
const getCardPrediction = functions.httpsCallable('getCardPrediction')

export const gainXpWithChance = (user: User | null, ref: MutableRefObject<number>) => {
	if (Math.random() > XP_CHANCE)
		return 0
	
	if (user)
		firestore.doc(`users/${user.id}`).update({
			xp: firebase.firestore.FieldValue.increment(1)
		})
	
	ref.current++
	
	return 1
}

export const getProgressDataForRating = (rating: PerformanceRating, isMastered: boolean) => {
	switch (rating) {
		case PerformanceRating.Easy:
			return {
				emoji: '🥳',
				message: isMastered ? 'Mastered!' : 'You\'re doing great!'
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

export const performanceRatingToHardMultiplier = (rating: PerformanceRating) => {
	switch (rating) {
		case PerformanceRating.Easy:
			return 0
		case PerformanceRating.Struggled:
			return 1
		case PerformanceRating.Forgot:
			return 2
	}
}

export default (deck: Deck | null, sectionId: string) => {
	const start = useRef(new Date())
	const startOfCurrentCard = useRef(new Date())
	
	const xpGained = useRef(0)
	const isReviewingNewCards = useRef(false)
	
	const isWaitingForInit = useRef(true)
	const shouldIncrementCurrentIndex = useRef(true)
	
	const [user, userLoadingState] = useCurrentUser()
	
	const [card, setCard] = useState(null as _Card | null)
	const [count, setCount] = useState(null as number | null)
	
	const [currentIndex, setCurrentIndex] = useState(-1) // Incremented beforehand
	
	const [loadingState, setLoadingState] = useState(LoadingState.Loading)
	const [predictionLoadingState, setPredictionLoadingState] = useState(LoadingState.Loading)
	
	const [cards, setCards] = useState([] as _Card[])
	
	const [currentSide, setCurrentSide] = useState('front' as 'front' | 'back')
	const [isWaitingForRating, setIsWaitingForRating] = useState(false)
	const [cardClassName, setCardClassName] = useState(undefined as string | undefined)
	
	const [isProgressShowing, setIsProgressShowing] = useState(false)
	const [progressData, _setProgressData] = useState(null as Progress | null)
	
	const [isRecapShowing, setIsRecapShowing] = useState(false)
	const [recapData, setRecapData] = useState(null as Recap | null)
	
	const setProgressData = useCallback(async (data: Progress) => {
		_setProgressData(data)
		setIsProgressShowing(true)
		
		await sleep(PROGRESS_SHOW_DURATION)
		
		setIsProgressShowing(false)
	}, [_setProgressData, setIsProgressShowing])
	
	const showRecap = useCallback((flag: boolean = true) => {
		if (!flag || count === null)
			return
		
		setIsRecapShowing(true)
		setRecapData({
			start: start.current,
			xpGained: xpGained.current,
			reviewedCount: cards.reduce((acc, { rating }) => (
				acc + (rating === null ? 0 : 1)
			), 0),
			masteredCount: cards.reduce((acc, { isNewlyMastered }) => (
				acc + (isNewlyMastered ? 1 : 0)
			), 0),
			totalCount: count
		})
	}, [cards, count, setIsRecapShowing, setRecapData])
	
	const incrementCurrentIndex = useCallback(() => {
		setCurrentIndex(currentIndex => {
			const newIndex = currentIndex + 1
			
			if (newIndex === count)
				setCount(count => (count ?? 0) + 1)
			
			return newIndex
		})
	}, [setCurrentIndex, count, setCount])
	
	const getCard = useCallback(async (deckId: string, cardId: string) => {
		const snapshot = await firestore.doc(`decks/${deckId}/cards/${cardId}`).get()
		
		return {
			value: Card.fromSnapshot(snapshot, null),
			snapshot
		}
	}, [])
	
	/** @returns If the recap should be shown or not */
	const next = useCallback(async (): Promise<boolean> => {
		if (!(deck && userLoadingState === LoadingState.Success))
			return true
		
		if (shouldIncrementCurrentIndex.current)
			incrementCurrentIndex()
		
		shouldIncrementCurrentIndex.current = true
		
		setLoadingState(LoadingState.Loading)
		
		if (!user) {
			let query = firestore
				.collection(`decks/${deck.id}/cards`)
				.where('section', '==', sectionId)
			
			if (card)
				query = query.startAfter(card.snapshot)
			
			const { docs } = await query.limit(1).get()
			const snapshot = docs[0]
			
			if (!snapshot) {
				setLoadingState(LoadingState.Success)
				return true
			}
			
			const newCard: _Card = {
				...await getCard(deck.id, snapshot.id),
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
		
		if (isReviewingNewCards.current) {
			const { docs } = await firestore
				.collection(`users/${user.id}/decks/${deck.id}/cards`)
				.where('section', '==', sectionId)
				.where('new', '==', true)
				.limit(1)
				.get()
			
			const snapshot = docs[0]
			
			if (!snapshot) {
				setLoadingState(LoadingState.Success)
				return true
			}
			
			const newCard: _Card = {
				...await getCard(deck.id, snapshot.id),
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
			.collection(`users/${user.id}/decks/${deck.id}/cards`)
			.where('section', '==', sectionId)
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
		
		const newCard: _Card = {
			...await getCard(deck.id, snapshot.id),
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
	}, [user, userLoadingState, incrementCurrentIndex, sectionId, deck, card, getCard, setLoadingState, setCards, setCard])
	
	const transitionSetCurrentSide = useCallback(async (side: SetStateAction<'front' | 'back'>) => {
		setCardClassName('flip')
		
		await sleep(FLIP_ANIMATION_DURATION / 2)
		setCurrentSide(side)
		await sleep(FLIP_ANIMATION_DURATION / 2)
		
		setCardClassName(undefined)
	}, [setCardClassName, setCurrentSide])
	
	const transitionNext = useCallback(async () => {
		setCardClassName('shift')
		
		await sleep(SHIFT_ANIMATION_DURATION / 2)
		
		setCurrentSide('front')
		next().then(showRecap)
		
		await sleep(SHIFT_ANIMATION_DURATION / 2)
		
		setCardClassName(undefined)
	}, [setCardClassName, setCurrentSide, next, showRecap])
	
	const rate = useCallback(async (rating: PerformanceRating) => {
		if (!(deck && card))
			return showRecap()
		
		const streak = rating === PerformanceRating.Forgot
			? 0
			: card.streak + 1
		
		setIsWaitingForRating(false)
		setProgressData({
			xp: gainXpWithChance(user, xpGained),
			streak,
			rating,
			next: card.prediction && card.prediction[rating],
			didNewlyMaster: streak === MASTERED_STREAK,
			...getProgressDataForRating(
				rating,
				streak >= MASTERED_STREAK
			)
		})
		
		setLoadingState(LoadingState.Loading)
		
		card.rating = rating
		card.streak = streak
		card.isNewlyMastered = (
			await reviewCard({
				deck: deck.id,
				section: sectionId,
				card: card.value.id,
				rating,
				viewTime: Date.now() - startOfCurrentCard.current.getTime()
			})
		).data
		
		transitionNext()
	}, [deck, card, user, sectionId, setIsWaitingForRating, showRecap, transitionNext, setProgressData, setLoadingState])
	
	const flip = useCallback(() => {
		transitionSetCurrentSide(side =>
			side === 'front' ? 'back' : 'front'
		)
	}, [transitionSetCurrentSide])
	
	const waitForRating = useCallback(async () => {
		if (isWaitingForRating || isProgressShowing || isRecapShowing || loadingState !== LoadingState.Success)
			return
		
		setIsWaitingForRating(true)
		transitionSetCurrentSide('back')
	}, [isWaitingForRating, isProgressShowing, isRecapShowing, loadingState, setIsWaitingForRating, transitionSetCurrentSide])
	
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
			handleError(error)
			setPredictionLoadingState(LoadingState.Fail)
		})
	}, [deck, card, loadingState, setPredictionLoadingState])
	
	useEffect(() => {
		if (loadingState !== LoadingState.Success)
			return
		
		startOfCurrentCard.current = new Date()
		setCurrentSide('front')
	}, [loadingState, setCurrentSide])
	
	useEffect(() => {
		if (isWaitingForInit.current && deck && userLoadingState === LoadingState.Success) {
			next().then(showRecap)
			isWaitingForInit.current = false
		}
	}, [deck, userLoadingState, next, showRecap])
	
	return {
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
	}
}
