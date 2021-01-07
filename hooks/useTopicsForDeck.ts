import { useMemo } from 'react'

import Deck from 'models/Deck'
import useTopics from './useTopics'

const useTopicsForDeck = ({ topics }: Deck) => {
	const allTopics = useTopics()

	return useMemo(() => allTopics?.filter(({ id }) => topics.includes(id)), [
		topics,
		allTopics
	])
}

export default useTopicsForDeck
