import { useState, useCallback } from 'react'

import PerformanceRating from '../../../models/PerformanceRating'
import deck from '../../../data/preview.json'

export default () => {
	const [cards, setCards] = useState(deck.cards)
	const []
	
	const rate = useCallback((rating: PerformanceRating) => {
		
	}, [])
	
	return {
		cards,
		rate
	}
}
