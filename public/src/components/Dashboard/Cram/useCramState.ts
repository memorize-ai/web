import { useMemo, useCallback, useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import firebase from '../../../firebase'
import Section from '../../../models/Section'
import Card from '../../../models/Card'
import LoadingState from '../../../models/LoadingState'
import PerformanceRating from '../../../models/PerformanceRating'
import useDecks from '../../../hooks/useDecks'
import useSections from '../../../hooks/useSections'

import 'firebase/firestore'

export interface CramCard {
	value: Card
	snapshot: firebase.firestore.DocumentSnapshot
	ratings: PerformanceRating[]
}

const firestore = firebase.firestore()

export const isCardMastered = ({ ratings }: CramCard) => {
	let easyCount = 0
	
	for (let i = ratings.length - 1; i >= 0; i--) {
		if (ratings[i] !== PerformanceRating.Easy)
			break
		
		if (++easyCount === 3)
			return true
	}
	
	return false
}

export default (
	slugId: string | undefined,
	slug: string | undefined,
	sectionId: string | undefined
) => {
	const history = useHistory()
	
	const [loadingState, setLoadingState] = useState(LoadingState.Loading)
	const [shouldShowRecap, setShouldShowRecap] = useState(false)
	
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
	
	const sections = useSections(deck?.id)
	const [cards, setCards] = useState([] as CramCard[])
	
	const [count, setCount] = useState(null as number | null)
	const [currentIndex, setCurrentIndex] = useState(null as number | null)
	
	const [section, setSection] = useState(null as Section | null)
	const [card, setCard] = useState(null as CramCard | null)
	
	// Returns whether you should show the recap or not
	const next = useCallback(async (): Promise<boolean> => {
		if (!deck)
			return false
		
		const index = (currentIndex ?? -1) + 1
		setCurrentIndex(index => (index ?? -1) + 1)
		
		// Cramming a single section
		if (sectionId) {
			if (index in cards) {
				const card = cards[index]
				
				if (isCardMastered(card))
					return next()
				
				setCard(card)
				setLoadingState(LoadingState.Success)
				
				return false
			}
			
			setLoadingState(LoadingState.Loading)
			
			let query = firestore
				.collection(`decks/${deck.id}/cards`)
				.where('section', '==', sectionId)
			
			if (card?.value.sectionId === sectionId)
				query = query.startAfter(card.snapshot)
			
			const { docs } = await query.limit(1).get()
			const snapshot = docs[0]
			
			if (!snapshot)
				return true
			
			const nextCard: CramCard = {
				value: Card.fromSnapshot(snapshot, null),
				snapshot,
				ratings: []
			}
			
			setCards(cards => [...cards, nextCard])
			setCard(nextCard)
			setLoadingState(LoadingState.Success)
			
			return false
		}
		
		// TODO: Review deck
		return true
	}, [currentIndex, sectionId, deck, cards, card, setLoadingState, setCard])
	
	const skip = useCallback(() => {
		next().then(setShouldShowRecap)
	}, [next, setShouldShowRecap])
	
	const rate = useCallback((rating: PerformanceRating) => {
		if (currentIndex === null)
			return
		
		cards[currentIndex].ratings.push(rating)
		next().then(setShouldShowRecap)
	}, [cards, currentIndex, next, setShouldShowRecap])
	
	useEffect(() => {
		if (!(sections && count === null))
			return
		
		setCount(sections.reduce((acc, { numberOfCards }) => (
			acc + numberOfCards
		), 0))
		
		if (sectionId) {
			const section = sections.find(section => section.id === sectionId)
			
			if (section) {
				setSection(section)
				next().then(setShouldShowRecap)
			}
			
			return
		}
		
		next().then(setShouldShowRecap)
	}, [sections, count, setCount, sectionId, setSection, next, setShouldShowRecap])
	
	return { deck, section, card, currentIndex, count, loadingState, shouldShowRecap, skip, rate }
}
