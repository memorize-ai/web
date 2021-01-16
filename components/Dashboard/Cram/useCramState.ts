import {
	useMemo,
	useCallback,
	useState,
	useEffect,
	useRef,
	MutableRefObject,
	SetStateAction
} from 'react'
import Router from 'next/router'

import firebase from 'lib/firebase'
import User from 'models/User'
import Section from 'models/Section'
import Card from 'models/Card'
import LoadingState from 'models/LoadingState'
import PerformanceRating from 'models/PerformanceRating'
import useDecks from 'hooks/useDecks'
import useSections from 'hooks/useSections'
import useCurrentUser from 'hooks/useCurrentUser'
import sleep from 'lib/sleep'
import { CARD_ACTIONS } from './CardContainer'

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

export interface CramRecapData {
	start: Date
	xpGained: number
	masteredCount: number
	totalCount: number
	easiestSection: Section | null
	hardestSection: Section | null
	isSameSection: boolean
}

export interface CardActions {
	flip: string
	shift: string
}

export const CRAM_MASTERED_STREAK = 3

const SHIFT_ANIMATION_DURATION = 400
const FLIP_ANIMATION_DURATION = 300
const PROGRESS_MODAL_SHOW_DURATION = 1000
const XP_CHANCE = 0.2

const firestore = firebase.firestore()

export const isCardMastered = ({ ratings }: CramCard) => {
	let easyCount = 0

	for (let i = ratings.length - 1; i >= 0; i--) {
		if (ratings[i] !== PerformanceRating.Easy) break

		if (++easyCount === CRAM_MASTERED_STREAK) return true
	}

	return false
}

export const getCardStreak = ({ ratings }: CramCard) => {
	let acc = 0

	for (let i = ratings.length - 1; i >= 0; i--, acc++)
		if (ratings[i] !== PerformanceRating.Easy) break

	return acc
}

export const getMasteredCount = (cards: CramCard[]) =>
	cards.reduce((acc, card) => acc + (isCardMastered(card) ? 1 : 0), 0)

export const gainXpWithChance = (user: User, ref: MutableRefObject<number>) => {
	if (Math.random() > XP_CHANCE) return 0

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
				message: "You're doing great!"
			}
		case PerformanceRating.Struggled:
			return {
				emoji: '🧐',
				message: "You'll see this again soon!"
			}
		case PerformanceRating.Forgot:
			return {
				emoji: '🤕',
				message: 'Better luck next time!'
			}
	}
}

const useCramState = (
	slugId: string | undefined,
	slug: string | undefined,
	rawSectionId: string | undefined
) => {
	const start = useRef(new Date())
	const xpGained = useRef(0)

	const sectionId = useMemo(
		() => (rawSectionId === 'unsectioned' ? '' : rawSectionId),
		[rawSectionId]
	)

	const [currentUser, currentUserLoadingState] = useCurrentUser()
	const [loadingState, setLoadingState] = useState(LoadingState.Loading)

	const [currentSide, setCurrentSide] = useState('front' as 'front' | 'back')
	const [isWaitingForRating, setIsWaitingForRating] = useState(false)
	const [cardClassName, setCardClassName] = useState(
		undefined as string | undefined
	)

	const [isProgressModalShowing, setIsProgressModalShowing] = useState(false)
	const [progressData, _setProgressData] = useState(
		null as CramProgressData | null
	)

	const [isRecapModalShowing, _setIsRecapModalShowing] = useState(false)
	const [recapData, setRecapData] = useState(null as CramRecapData | null)

	const [isCurrentCardMastered, setIsCurrentCardMastered] = useState(false)

	const [decks, decksLoadingState] = useDecks()

	const goToDeckPage = useCallback(() => {
		Router.push(`/d/${slugId ?? ''}/${slug ? encodeURIComponent(slug) : ''}`)
	}, [slugId, slug])

	const goBack = useCallback(() => {
		Router.push(
			`/decks/${slugId ?? ''}/${slug ? encodeURIComponent(slug) : ''}`
		)
	}, [slugId, slug])

	const deck = useMemo(() => {
		if (
			currentUser === null &&
			currentUserLoadingState === LoadingState.Success
		) {
			goToDeckPage()
			return null
		}

		if (decksLoadingState !== LoadingState.Success) return null

		const deck = decks.find(deck => deck.slugId === slugId)

		if (deck) return deck

		goToDeckPage()
		return null
	}, [
		currentUser,
		currentUserLoadingState,
		decksLoadingState,
		decks,
		slugId,
		goToDeckPage
	])

	const namedSections = useSections(deck?.id)
	const sections = useMemo(
		() =>
			deck &&
			namedSections &&
			[deck.unsectionedSection, ...namedSections].filter(
				section => deck.isSectionUnlocked(section) && section.numberOfCards > 0
			),
		[deck, namedSections]
	)

	const [cards, setCards] = useState([] as CramCard[])

	const [count, setCount] = useState(null as number | null)
	const [currentIndex, setCurrentIndex] = useState(null as number | null)

	const [section, setSection] = useState(null as Section | null)
	const [card, setCard] = useState(null as CramCard | null)

	const masteredCount = useMemo(() => getMasteredCount(cards), [cards])

	const seenCount = useMemo(() => cards.length - masteredCount, [
		cards.length,
		masteredCount
	])

	const unseenCount = useMemo(() => (count ?? 0) - cards.length, [
		count,
		cards.length
	])

	const incrementCurrentIndex = useCallback(() => {
		const getNewIndex = (index: number | null) =>
			count === null || index === count - 1 ? 0 : (index ?? -1) + 1

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
	}, [
		sectionId,
		count,
		currentIndex,
		setCurrentIndex,
		sections,
		setSection,
		section
	])

	const setProgressData = useCallback(
		async (data: CramProgressData) => {
			_setProgressData(data)
			setIsProgressModalShowing(true)

			await sleep(PROGRESS_MODAL_SHOW_DURATION)

			setIsProgressModalShowing(false)
		},
		[_setProgressData, setIsProgressModalShowing]
	)

	const setIsRecapModalShowing = useCallback(
		(isShowing: boolean) => {
			isShowing ? _setIsRecapModalShowing(true) : goBack()
		},
		[_setIsRecapModalShowing, goBack]
	)

	const showRecap: (flag?: boolean) => void = useCallback(
		(flag = true) => {
			if (!(flag && sections && count)) return

			const nonEasyAttempts =
				sectionId === undefined
					? Object.entries(
							cards.reduce((acc: Record<string, number>, card) => {
								acc[card.value.sectionId] =
									(acc[card.value.sectionId] ?? 0) +
									card.ratings.reduce(
										(acc, rating) =>
											acc + (rating === PerformanceRating.Easy ? 0 : 1),
										0
									)

								return acc
							}, {})
					  )
					: []

			const easiestSectionId =
				sectionId === undefined
					? nonEasyAttempts.reduce(
							([oldKey, oldValue], [key, value]) =>
								value < oldValue ? [key, value] : [oldKey, oldValue],
							['', Number.MAX_SAFE_INTEGER]
					  )[0]
					: null

			const hardestSectionId =
				sectionId === undefined
					? nonEasyAttempts.reduce(
							([oldKey, oldValue], [key, value]) =>
								value > oldValue ? [key, value] : [oldKey, oldValue],
							['', -1]
					  )[0]
					: null

			setIsRecapModalShowing(true)
			setRecapData({
				start: start.current,
				xpGained: xpGained.current,
				masteredCount,
				totalCount: count,
				easiestSection:
					easiestSectionId === null
						? null
						: sections.find(section => section.id === easiestSectionId) ?? null,
				hardestSection:
					hardestSectionId === null
						? null
						: sections.find(section => section.id === hardestSectionId) ?? null,
				isSameSection:
					easiestSectionId !== null && easiestSectionId === hardestSectionId
			})
		},
		[
			sections,
			count,
			cards,
			sectionId,
			setIsRecapModalShowing,
			setRecapData,
			masteredCount
		]
	)

	/** @returns Whether you should show the recap or not */
	const loadNext = useCallback(
		async (deckId: string, sectionId: string) => {
			let query = firestore
				.collection(`decks/${deckId}/cards`)
				.where('section', '==', sectionId)

			if (card && card.value.sectionId === sectionId)
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
		},
		[card, setLoadingState, setCards, setCard]
	)

	/** @returns Whether you should show the recap or not */
	const next = useCallback(async () => {
		if (!deck || getMasteredCount(cards) === count) return true

		const [index, section] = incrementCurrentIndex()

		if (index in cards) {
			const card = cards[index]

			if (isCardMastered(card)) {
				setIsCurrentCardMastered(true)
				return false
			}

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
	}, [
		deck,
		cards,
		count,
		incrementCurrentIndex,
		setIsCurrentCardMastered,
		setCard,
		setLoadingState,
		sectionId,
		loadNext
	])

	const transitionSetCurrentSide = useCallback(
		async (side: SetStateAction<'front' | 'back'>) => {
			setCardClassName(CARD_ACTIONS.flip)

			await sleep(FLIP_ANIMATION_DURATION / 2)
			setCurrentSide(side)
			await sleep(FLIP_ANIMATION_DURATION / 2)

			setCardClassName(undefined)
		},
		[setCardClassName, setCurrentSide]
	)

	const flip = useCallback(() => {
		transitionSetCurrentSide(side => (side === 'front' ? 'back' : 'front'))
	}, [transitionSetCurrentSide])

	const transitionNext = useCallback(async () => {
		setCardClassName(CARD_ACTIONS.shift)

		await sleep(SHIFT_ANIMATION_DURATION / 2)

		setCurrentSide('front')
		next().then(showRecap)

		await sleep(SHIFT_ANIMATION_DURATION / 2)

		setCardClassName(undefined)
	}, [setCardClassName, setCurrentSide, next, showRecap])

	const skip = useCallback(() => {
		setCards(cards =>
			cards.map((card, i) =>
				currentIndex === i ? { ...card, isNew: false } : card
			)
		)

		if (card && masteredCount < (count ?? 0)) {
			transitionNext()
			setProgressData({
				xp: 0,
				streak: getCardStreak(card),
				emoji: '😛',
				message: 'Skipped!'
			})
		}
	}, [
		setCards,
		currentIndex,
		card,
		masteredCount,
		count,
		transitionNext,
		setProgressData
	])

	const rate = useCallback(
		(rating: PerformanceRating) => {
			if (currentIndex === null) return

			let updatedCard: CramCard | null = null

			const newCards = cards.map((card, i) =>
				currentIndex === i
					? (updatedCard = {
							...card,
							ratings: [...card.ratings, rating],
							isNew: false
					  })
					: card
			)

			setCards(newCards)
			setIsWaitingForRating(false)

			if (!currentUser || !updatedCard || getMasteredCount(newCards) === count)
				return showRecap()

			transitionNext()
			setProgressData({
				xp: gainXpWithChance(currentUser, xpGained),
				streak: getCardStreak(updatedCard),
				...getProgressDataForRating(rating)
			})
		},
		[
			currentIndex,
			cards,
			setCards,
			count,
			setIsWaitingForRating,
			showRecap,
			transitionNext,
			setProgressData,
			currentUser
		]
	)

	const waitForRating = useCallback(() => {
		if (
			isWaitingForRating ||
			isProgressModalShowing ||
			isRecapModalShowing ||
			loadingState !== LoadingState.Success
		)
			return

		setIsWaitingForRating(true)
		transitionSetCurrentSide('back')
	}, [
		isWaitingForRating,
		isProgressModalShowing,
		isRecapModalShowing,
		loadingState,
		setIsWaitingForRating,
		transitionSetCurrentSide
	])

	useEffect(() => {
		if (!(sections && count === null)) return

		if (sectionId === undefined) {
			// Multiple sections

			setCount(
				sections.reduce((acc, { numberOfCards }) => acc + numberOfCards, 0)
			)

			next().then(showRecap)
			return
		}

		// Single section

		const section = sections.find(section => section.id === sectionId)

		if (section) {
			setSection(section)
			setCount(section.numberOfCards)

			next().then(showRecap)
		}
	}, [sections, count, setCount, sectionId, setSection, next, showRecap])

	useEffect(() => {
		if (isCurrentCardMastered) {
			setIsCurrentCardMastered(false)
			next().then(showRecap)
		}
	}, [isCurrentCardMastered, setIsCurrentCardMastered, next, showRecap])

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
		recapData,
		isRecapModalShowing,
		setIsRecapModalShowing,
		showRecap,
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

export default useCramState
