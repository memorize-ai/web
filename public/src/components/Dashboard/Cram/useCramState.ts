import { useMemo, useCallback, useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import firebase from '../../../firebase'
import User from '../../../models/User'
import Section from '../../../models/Section'
import Card from '../../../models/Card'
import LoadingState from '../../../models/LoadingState'
import PerformanceRating from '../../../models/PerformanceRating'
import useDecks from '../../../hooks/useDecks'
import useSections from '../../../hooks/useSections'
import useCurrentUser from '../../../hooks/useCurrentUser'
import { sleep } from '../../../utils'

import 'firebase/firestore'

export interface CramCard {
	value: Card
	snapshot: firebase.firestore.DocumentSnapshot
	ratings: PerformanceRating[]
	isNew: boolean
}

export interface CramProgressData {
	xp: number
	streak: number
	emoji: string
	message: string
}

export const CRAM_MASTERED_STREAK = 3

const SHIFT_ANIMATION_DURATION = 400
const PROGRESS_MODAL_SHOW_DURATION = 1000
const XP_CHANCE = 0.2

const firestore = firebase.firestore()

export const isCardMastered = ({ ratings }: CramCard) => {
	let easyCount = 0
	
	for (let i = ratings.length - 1; i >= 0; i--) {
		if (ratings[i] !== PerformanceRating.Easy)
			break
		
		if (++easyCount === CRAM_MASTERED_STREAK)
			return true
	}
	
	return false
}

export const getCardStreak = ({ ratings }: CramCard) => {
	let acc = 0
	
	for (let i = ratings.length - 1; i >= 0; i--, acc++)
		if (ratings[i] !== PerformanceRating.Easy)
			break
	
	return acc
}

export const getMasteredCount = (cards: CramCard[]) =>
	cards.reduce((acc, card) => (
		acc + (isCardMastered(card) ? 1 : 0)
	), 0)

export const gainXpWithChance = (user: User) => {
	if (Math.random() > XP_CHANCE)
		return 0
	
	firestore.doc(`users/${user.id}`).update({
		xp: firebase.firestore.FieldValue.increment(1)
	})
	
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
	const sectionId = useMemo(() => (
		_sectionId === 'unsectioned' ? '' : _sectionId
	), [_sectionId])
	
	const history = useHistory()
	const [currentUser] = useCurrentUser()
	
	const [loadingState, setLoadingState] = useState(LoadingState.Loading)
	const [shouldShowRecap, setShouldShowRecap] = useState(false)
	
	const [currentSide, setCurrentSide] = useState('front' as 'front' | 'back')
	const [isWaitingForRating, setIsWaitingForRating] = useState(false)
	const [cardClassName, setCardClassName] = useState(undefined as string | undefined)
	
	const [isProgressModalShowing, setIsProgressModalShowing] = useState(false)
	const [progressData, _setProgressData] = useState(null as CramProgressData | null)
	
	const [decks, decksLoadingState] = useDecks()
	
	const deck = useMemo(() => {
		if (decksLoadingState !== LoadingState.Success)
			return null
		
		const deck = decks.find(deck => deck.slugId === slugId)
		
		if (deck)
			return deck
		
		history.push(`/d/${slugId}/${slug}`)
		
		return null
	}, [decks, decksLoadingState, slugId, slug, history])
	
	const _sections = useSections(deck?.id)
	const sections = useMemo(() => (
		deck && _sections && [
			deck.unsectionedSection,
			..._sections
		].filter(section =>
			deck.isSectionUnlocked(section) && section.numberOfCards > 0
		)
	), [deck, _sections])
	
	const [cards, setCards] = useState([] as CramCard[])
	
	const [count, setCount] = useState(null as number | null)
	const [currentIndex, setCurrentIndex] = useState(null as number | null)
	
	const [section, setSection] = useState(null as Section | null)
	const [card, setCard] = useState(null as CramCard | null)
	
	const masteredCount = useMemo(() => getMasteredCount(cards), [cards])
	
	const seenCount = useMemo(() => (
		cards.length - masteredCount
	), [cards.length, masteredCount])
	
	const unseenCount = useMemo(() => (
		(count ?? 0) - cards.length
	), [count, cards.length])
	
	const incrementCurrentIndex = useCallback(() => {
		const getNewIndex = (index: number | null) =>
			count === null || index === count - 1
				? 0
				: (index ?? -1) + 1
		
		const index = getNewIndex(currentIndex)
		setCurrentIndex(index => getNewIndex(index))
		
		if (sectionId === undefined) {
			let cardCountAcc = 0
			
			for (const section of sections ?? []) {
				if (cardCountAcc + section.numberOfCards > index) {
					setSection(section)
					return [index, section] as const
				}
				
				cardCountAcc += section.numberOfCards
			}
		}
		
		return [index, section] as const
	}, [sectionId, count, currentIndex, setCurrentIndex, sections, setSection, section])
	
	const setProgressData = useCallback(async (data: CramProgressData) => {
		_setProgressData(data)
		setIsProgressModalShowing(true)
		
		await sleep(PROGRESS_MODAL_SHOW_DURATION)
		
		setIsProgressModalShowing(false)
	}, [_setProgressData, setIsProgressModalShowing])
	
	/** @returns Whether you should show the recap or not */
	const loadNext = useCallback(async (deckId: string, sectionId: string) => {
		let query = firestore
			.collection(`decks/${deckId}/cards`)
			.where('section', '==', sectionId)
		
		if (card && (card.value.sectionId === sectionId))
			query = query.startAfter(card.snapshot)
		
		const { docs } = await query.limit(1).get()
		const snapshot = docs[0]
		
		if (!snapshot) {
			setLoadingState(LoadingState.Success)
			return true
		}
		
		const nextCard: CramCard = {
			value: Card.fromSnapshot(snapshot, null),
			snapshot,
			ratings: [],
			isNew: true
		}
		
		setCards(cards => [...cards, nextCard])
		setCard(nextCard)
		setLoadingState(LoadingState.Success)
		
		return false
	}, [card, setLoadingState, setCards, setCard])
	
	/** @returns Whether you should show the recap or not */
	const next = useCallback(async (): Promise<boolean> => {
		if (!deck)
			return false
		
		const [index, section] = incrementCurrentIndex()
		
		if (index in cards) {
			const card = cards[index]
			
			if (isCardMastered(card))
				return next()
			
			setCard(card)
			setLoadingState(LoadingState.Success)
			
			return false
		}
		
		setLoadingState(LoadingState.Loading)
		
		return sectionId === undefined
			? section // Multiple sections
				? loadNext(deck.id, section.id)
				: true
			: loadNext(deck.id, sectionId) // Single section
	}, [deck, incrementCurrentIndex, cards, setCard, setLoadingState, sectionId, loadNext])
	
	const flip = useCallback(() => {
		setCurrentSide(side =>
			side === 'front' ? 'back' : 'front'
		)
	}, [setCurrentSide])
	
	const transitionNext = useCallback(async () => {
		setCardClassName('shift')
		
		await sleep(SHIFT_ANIMATION_DURATION / 2)
		
		setCurrentSide('front')
		next().then(setShouldShowRecap)
		
		await sleep(SHIFT_ANIMATION_DURATION / 2)
		
		setCardClassName(undefined)
	}, [setCardClassName, setCurrentSide, next, setShouldShowRecap])
	
	const skip = useCallback(() => {
		setCards(cards =>
			cards.map((card, i) =>
				currentIndex === i
					? { ...card, isNew: false }
					: card
			)
		)
		
		if (card && (masteredCount < (count ?? 0))) {
			transitionNext()
			setProgressData({
				xp: 0,
				streak: getCardStreak(card),
				emoji: '😛',
				message: 'Skipped!'
			})
		}
	}, [setCards, currentIndex, card, masteredCount, count, transitionNext, setProgressData])
	
	const rate = useCallback((rating: PerformanceRating) => {
		if (currentIndex === null)
			return
		
		let updatedCard: CramCard | null = null
		
		const newCards = cards.map((card, i) =>
			currentIndex === i
				? updatedCard = {
					...card,
					ratings: [...card.ratings, rating],
					isNew: false
				}
				: card
		)
		
		setCards(newCards)
		setIsWaitingForRating(false)
		
		if (!currentUser || !updatedCard || (getMasteredCount(newCards) === count))
			return setShouldShowRecap(true)
		
		transitionNext()
		setProgressData({
			xp: gainXpWithChance(currentUser),
			streak: getCardStreak(updatedCard),
			...getProgressDataForRating(rating)
		})
	}, [currentIndex, cards, setCards, count, setIsWaitingForRating, setShouldShowRecap, transitionNext, setProgressData, currentUser])
	
	useEffect(() => {
		if (!(sections && count === null))
			return
		
		if (sectionId === undefined) {
			// Multiple sections
			
			setCount(sections.reduce((acc, { numberOfCards }) => (
				acc + numberOfCards
			), 0))
			
			next().then(setShouldShowRecap)
			return
		}
		
		// Single section
		
		const section = sections.find(section => section.id === sectionId)
		
		if (section) {
			setSection(section)
			setCount(section.numberOfCards)
			
			next().then(setShouldShowRecap)
		}
	}, [sections, count, setCount, sectionId, setSection, next, setShouldShowRecap])
	
	const waitForRating = useCallback(async () => {
		if (isWaitingForRating || loadingState !== LoadingState.Success)
			return
		
		setIsWaitingForRating(true)
		setCurrentSide('back')
	}, [isWaitingForRating, loadingState, setIsWaitingForRating, setCurrentSide])
	
	return {
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
		shouldShowRecap,
		counts: {
			mastered: masteredCount,
			seen: seenCount,
			unseen: unseenCount
		},
		currentSide,
		flip,
		skip,
		rate
	}
}
