import {
	MouseEvent,
	useState,
	useMemo,
	useCallback,
	SetStateAction,
	useEffect,
	useRef
} from 'react'

import PreviewDeck from 'models/PreviewDeck'
import firebase from 'lib/firebase'
import { PreviewSection, PreviewCard } from 'models/PreviewDeck'
import PerformanceRating from 'models/PerformanceRating'
import useAuthModal from 'hooks/useAuthModal'
import { sleep, handleError } from 'lib/utils'

import 'firebase/firestore'

/** `null` - Immediately after */
export interface PreviewPredictions {
	[PerformanceRating.Easy]: Date | null
	[PerformanceRating.Struggled]: Date | null
	[PerformanceRating.Forgot]: Date | null
}

export interface PreviewProgressData {
	xp: number
	streak: number
	rating: PerformanceRating
	next: Date | null
	emoji: string
	message: string
}

export interface PreviewRecapData {
	start: Date
	xpGained: number
	reviewedCount: number
	easiest: PreviewSection | null
	hardest: PreviewSection | null
	isSame: boolean
}

export interface UsePreviewCardActions {
	flip: string
	shift: string
}

export type CardSide = 'front' | 'back'

const DEFAULT_EASY_INTERVAL = 1000 * 60 * 60 * 24 * 2
const MINIMUM_EASY_INTERVAL = 1000 * 60 * 60 * 12

const DEFAULT_STRUGGLED_INTERVAL = 1000 * 60 * 60 * 24
const MINIMUM_STRUGGLED_INTERVAL = 1000 * 60 * 60 * 6

const XP_CHANCE = 0.6

const FLIP_ANIMATION_DURATION = 300
const SHIFT_ANIMATION_DURATION = 300

const PROGRESS_MODAL_SHOW_DURATION = 1000

export const PREVIEW_MASTERED_STREAK = 6

const firestore = firebase.firestore()

const getPredictionMultiplier = (
	multiplier: number,
	rating: PerformanceRating
) => {
	switch (rating) {
		case PerformanceRating.Easy:
			return multiplier + 0.3
		case PerformanceRating.Struggled:
			return multiplier + 0.2
		case PerformanceRating.Forgot:
			return multiplier - 0.4
	}
}

const getRandomPredictionMultiplier = () => 1 + Math.random() - 0.5

const gainXpWithChance = (
	xp: number,
	setXp: (xp: number) => void,
	force: boolean
) => {
	if (!force && Math.random() > XP_CHANCE) return 0

	setXp(xp + 1)
	return 1
}

const getProgressDataForRating = (rating: PerformanceRating) => {
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

const usePreview = (
	deck: PreviewDeck | null,
	{ flip: flipAction, shift: shiftAction }: UsePreviewCardActions
) => {
	const isFirstCard = useRef(true)

	const start = useRef(null as Date | null)

	const [cards, setCards] = useState<PreviewCard[] | null>(null)
	const cardsRemaining = cards && cards.length

	const [cardClassName, setCardClassName] = useState(
		undefined as string | undefined
	)
	const [currentSide, setCurrentSide] = useState('front' as CardSide)
	const [isWaitingForRating, setIsWaitingForRating] = useState(false)

	const [isProgressModalShowing, setIsProgressModalShowing] = useState(false)
	const [progressData, _setProgressData] = useState(
		null as PreviewProgressData | null
	)

	const [predictionMultiplier, setPredictionMultiplier] = useState(1)
	const [toggleTurns, setToggleTurns] = useState(0)
	const [ranking, setRanking] = useState(null as number | null)

	const { initialXp, setInitialXp } = useAuthModal()

	const card = useMemo(() => cards?.[0] ?? null, [cards])
	const nextCard = useMemo(() => cards?.[1] ?? null, [cards])

	const section = useMemo(
		() => card && (deck?.sections?.[card.sectionId] ?? null),
		[deck, card]
	)

	const predictions: PreviewPredictions | null = useMemo(() => {
		if (!card) return null

		const now = Date.now()
		const reducer = (card.forgotCount ?? 0) + 1

		const getDate = (defaultInterval: number, minimumInterval: number) =>
			new Date(
				now +
					Math.max(
						minimumInterval,
						(defaultInterval *
							predictionMultiplier *
							getRandomPredictionMultiplier()) /
							reducer
					)
			)

		return {
			[PerformanceRating.Easy]: getDate(
				DEFAULT_EASY_INTERVAL,
				MINIMUM_EASY_INTERVAL
			),
			[PerformanceRating.Struggled]: getDate(
				DEFAULT_STRUGGLED_INTERVAL,
				MINIMUM_STRUGGLED_INTERVAL
			),
			[PerformanceRating.Forgot]: null
		}
	}, [card, predictionMultiplier])

	const setStart = useCallback(() => {
		if (!start.current) start.current = new Date()
	}, [])

	const setProgressData = useCallback(
		async (data: PreviewProgressData) => {
			_setProgressData(data)
			setIsProgressModalShowing(true)

			await sleep(PROGRESS_MODAL_SHOW_DURATION)

			setIsProgressModalShowing(false)
		},
		[_setProgressData, setIsProgressModalShowing]
	)

	const transitionSetCurrentSide = useCallback(
		async (side: SetStateAction<CardSide>) => {
			setCardClassName(flipAction)

			await sleep(FLIP_ANIMATION_DURATION / 2)
			setCurrentSide(side)
			await sleep(FLIP_ANIMATION_DURATION / 2)

			setCardClassName(undefined)
		},
		[flipAction, setCardClassName, setCurrentSide]
	)

	const next = useCallback(
		(addToBack: boolean) => {
			setCards(_cards => {
				if (!_cards) return null

				const cards = [..._cards]
				const card = cards.shift()

				if (addToBack && card) cards.push(card)

				return cards
			})
		},
		[setCards]
	)

	const transitionNext = useCallback(
		async (addToBack: boolean) => {
			setCardClassName(shiftAction)

			await sleep(SHIFT_ANIMATION_DURATION)

			setCurrentSide('front')
			next(addToBack)

			setCardClassName(undefined)
		},
		[shiftAction, setCardClassName, next]
	)

	const waitForRating = useCallback(async () => {
		if (isWaitingForRating || isProgressModalShowing || !cardsRemaining) return

		setStart()

		setIsWaitingForRating(true)
		transitionSetCurrentSide('back')
	}, [
		isWaitingForRating,
		isProgressModalShowing,
		cardsRemaining,
		setStart,
		setIsWaitingForRating,
		transitionSetCurrentSide
	])

	const flip = useCallback(() => {
		transitionSetCurrentSide(side => (side === 'front' ? 'back' : 'front'))
	}, [transitionSetCurrentSide])

	const rate = useCallback(
		async (rating: PerformanceRating) => {
			if (!(card && predictions)) return

			setIsWaitingForRating(false)
			setPredictionMultiplier(multiplier =>
				getPredictionMultiplier(multiplier, rating)
			)

			const didForget = rating === PerformanceRating.Forgot

			setProgressData({
				xp: gainXpWithChance(initialXp, setInitialXp, isFirstCard.current),
				streak: didForget ? 0 : 1,
				rating,
				next: predictions[rating],
				...getProgressDataForRating(rating)
			})

			if (didForget) card.forgotCount = (card.forgotCount ?? 0) + 1

			isFirstCard.current = false
			transitionNext(didForget)
		},
		[
			card,
			predictions,
			setIsWaitingForRating,
			setPredictionMultiplier,
			setProgressData,
			initialXp,
			setInitialXp,
			transitionNext
		]
	)

	const onCardClick = useCallback(
		(event: MouseEvent) => {
			if (!isWaitingForRating) return

			event.stopPropagation()
			flip()
		},
		[isWaitingForRating, flip]
	)

	useEffect(() => {
		if (deck) setCards(deck.cards)
	}, [deck, setCards])

	useEffect(() => {
		setToggleTurns(turns => turns + 1)
	}, [currentSide])

	useEffect(() => {
		if (cardsRemaining || !start.current) return

		const relativeScore =
			predictionMultiplier / (Date.now() - start.current.getTime())

		firestore
			.collection('previewDeckScores')
			.where('value', '>', relativeScore)
			.get()
			.then(({ docs }) => {
				setRanking(docs.length + 1)

				return firestore.collection('previewDeckScores').add({
					value: relativeScore
				})
			})
			.catch(handleError)
	}, [cardsRemaining, predictionMultiplier, setRanking])

	return {
		cardsRemaining,
		currentSide,
		isWaitingForRating,
		section,
		card,
		nextCard,
		predictions,
		cardClassName,
		toggleTurns,
		ranking,
		progressData,
		isProgressModalShowing,
		setIsProgressModalShowing,
		onCardClick,
		waitForRating,
		rate
	}
}

export default usePreview
