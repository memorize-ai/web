import { useState, useMemo, useCallback } from 'react'

import PerformanceRating from '../../../models/PerformanceRating'
import deck from '../../../data/preview.json'

export interface PreviewSection {
	id: string
	name: string
	index: number
	numberOfCards: number
}

export interface PreviewCard {
	id: string
	sectionId: string
	front: string
	back: string
	forgotCount?: number
}

export interface PreviewPredictions {
	[PerformanceRating.Easy]: Date
	[PerformanceRating.Struggled]: Date
	[PerformanceRating.Forgot]: Date
}

export type CardSide = 'front' | 'back'

const DEFAULT_EASY_INTERVAL = 1000 * 60 * 60 * 24 * 2
const DEFAULT_STRUGGLED_INTERVAL = 1000 * 60 * 60 * 24

const getPredictionMultiplier = () =>
	1 + Math.random() * 0.5 - 0.25

export default () => {
	const [cards, setCards] = useState(deck.cards as PreviewCard[])
	
	const [currentSide, setCurrentSide] = useState('front' as CardSide)
	const [isWaitingForRating, setIsWaitingForRating] = useState(false)
	
	const card = useMemo(() => (
		cards.length ? cards[0] : null
	), [cards])
	
	const nextCard = useMemo(() => (
		cards.length > 1 ? cards[1] : null
	), [cards])
	
	const section = useMemo(() => (
		card && (deck.sections as Record<string, PreviewSection>)[card.sectionId]
	), [card])
	
	const predictions: PreviewPredictions | null = useMemo(() => {
		if (!card)
			return null
		
		const now = Date.now()
		const reducer = (card.forgotCount ?? 0) + 1
		
		return {
			[PerformanceRating.Easy]: new Date(
				now + DEFAULT_EASY_INTERVAL * getPredictionMultiplier() / reducer
			),
			[PerformanceRating.Struggled]: new Date(
				now + DEFAULT_STRUGGLED_INTERVAL * getPredictionMultiplier() / reducer
			),
			[PerformanceRating.Forgot]: new Date(now)
		}
	}, [card])
	
	const flip = useCallback(() => {
		// TODO: Flip
	}, [])
	
	const rate = useCallback((rating: PerformanceRating) => {
		// TODO: Rate
	}, [])
	
	return {
		cardsRemaining: cards.length,
		currentSide,
		isWaitingForRating,
		deck,
		section,
		card,
		nextCard,
		predictions,
		flip,
		rate
	}
}
