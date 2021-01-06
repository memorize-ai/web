import { useMemo } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import groupBy from 'lodash/groupBy'

import User from 'models/User'
import Deck from 'models/Deck'
import Section from 'models/Section'
import Card from 'models/Card'
import Topic from 'models/Topic'
import Counters, { Counter } from 'models/Counters'
import { DeckPageQuery, DeckPageProps } from 'components/Dashboard/DeckPage/models'
import { formatNumber } from 'lib/utils'
import { BASE_URL, SIMILAR_DECKS_CHUNK_SIZE } from 'lib/constants'
import useDeck from 'hooks/useDeck'
import useCreator from 'hooks/useCreator'
import useSections from 'hooks/useSections'
import useAllCards from 'hooks/useAllCards'
import useTopicsForDeck from 'hooks/useTopicsForDeck'
import useSimilarDecks from 'hooks/useSimilarDecks'
import Dashboard, { DashboardNavbarSelection as Selection } from 'components/Dashboard'
import Head, { DEFAULT_OG_IMAGE } from 'components/Head'
import Navigation from 'components/Dashboard/DeckPage/Navigation'
import Header from 'components/Dashboard/DeckPage/Header'
import Preview from 'components/Dashboard/DeckPage/Preview'
import Footer from 'components/Dashboard/DeckPage/Footer'
import Controls from 'components/Dashboard/DeckPage/Controls'
import SimilarDecks from 'components/Dashboard/DeckPage/SimilarDecks'
import Cards from 'components/Dashboard/DeckPage/Cards'
import Comments from 'components/Dashboard/DeckPage/Comments'

const DeckPage: NextPage<DeckPageProps> = ({
	decks: initialNumberOfDecks,
	deck: initialDeckData,
	creator: initialCreatorData,
	sections: initialSectionData,
	cards: initialCardData,
	topics: initialTopicData
}) => {
	const initialDeck = useMemo(() => new Deck(initialDeckData), [initialDeckData])
	const initialCreator = useMemo(() => new User(initialCreatorData), [initialCreatorData])
	
	const initialSections = useMemo(() => (
		initialSectionData.map(data => new Section(data))
	), [initialSectionData])
	
	const initialCards = useMemo(() => (
		groupBy(initialCardData.map(data => new Card(data)), 'sectionId')
	), [initialCardData])
	
	const initialTopics = useMemo(() => (
		initialTopicData.map(data => new Topic(data))
	), [initialTopicData])
	
	const router = useRouter()
	
	const { deck: nextDeck, hasDeck } = useDeck((router.query as DeckPageQuery).slugId)
	const deck = nextDeck ?? initialDeck
	
	const image = deck.imageUrl ?? DEFAULT_OG_IMAGE
	const numberOfDecks = Counters.get(Counter.Decks) ?? initialNumberOfDecks
	
	const creator = useCreator(deck.creatorId) ?? initialCreator
	const sections = useSections(deck.id) ?? initialSections
	const cards = useAllCards(deck.id) ?? initialCards
	const topics = useTopicsForDeck(deck) ?? initialTopics
	const similarDecks = useSimilarDecks(deck, SIMILAR_DECKS_CHUNK_SIZE)
	
	const description = deck.description ||
		`${deck.averageRating.toFixed(1)} star${deck.averageRating === 1 ? '' : 's'
		} - ${formatNumber(deck.numberOfCards)} card${deck.numberOfCards === 1 ? '' : 's'
		} - ${formatNumber(deck.numberOfDownloads)} download${deck.numberOfDownloads === 1 ? '' : 's'
		}. Get ${deck.name} on memorize.ai by ${creator.name}.`
	
	return (
		<Dashboard selection={Selection.Market} className="deck-page">
			<Head
				title={`${deck.name} | memorize.ai`}
				description={description}
				image={image}
				labels={[
					{
						name: 'Rating',
						value: deck.numberOfRatings ? deck.averageRating.toFixed(1) : 'No ratings'
					},
					{ name: 'Downloads', value: formatNumber(deck.numberOfDownloads) },
					{ name: 'Cards', value: formatNumber(deck.numberOfCards) }
				]}
				breadcrumbs={url => [
					[
						{ name: 'Market', url: '/market' },
						{ name: deck.name, url }
					]
				]}
				schema={[
					{
						'@type': 'IndividualProduct',
						productID: deck.slugId,
						image,
						name: deck.name,
						description: deck.description,
						url: `${BASE_URL}${router.asPath}`,
						aggregateRating: {
							'@type': 'AggregateRating',
							ratingValue: deck.averageRating,
							reviewCount: deck.numberOfRatings || 1,
							worstRating: deck.worstRating,
							bestRating: deck.bestRating
						}
					}
				]}
			/>
			<Navigation numberOfDecks={numberOfDecks} />
			<div className="box">
				<Header deck={deck} creator={creator} hasDeck={hasDeck} />
				<Preview deck={deck} sections={sections} cards={cards} />
				<Footer deck={deck} topics={topics} />
				<Controls deck={deck} hasDeck={hasDeck} />
				<SimilarDecks similarDecks={similarDecks} />
				<Cards deck={deck} sections={sections} cards={cards} />
				<Comments deck={deck} />
			</div>
		</Dashboard>
	)
}

export { getStaticPaths, getStaticProps } from 'components/Dashboard/DeckPage/data'
export default DeckPage
