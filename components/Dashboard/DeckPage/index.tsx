import { useRef, useMemo, useEffect } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import groupBy from 'lodash/groupBy'

import User from 'models/User'
import Deck from 'models/Deck'
import Section from 'models/Section'
import Card from 'models/Card'
import Topic from 'models/Topic'
import { DeckPageQuery, DeckPageProps } from './models'
import formatNumber from 'lib/formatNumber'
import { BASE_URL, SIMILAR_DECKS_CHUNK_SIZE } from 'lib/constants'
import useDeck from 'hooks/useDeck'
import useSimilarDecks from 'hooks/useSimilarDecks'
import Dashboard, {
	DashboardNavbarSelection as Selection
} from 'components/Dashboard'
import Head, { DEFAULT_OG_IMAGE } from 'components/Head'
import Navigation from './Navigation'
import Header from './Header'
import Preview from './Preview'
import Footer from './Footer'
import Controls from './Controls'
import SimilarDecks from './SimilarDecks'
import Cards from './Cards'
import Comments from './Comments'

import styles from './index.module.scss'

const DeckPage: NextPage<DeckPageProps> = ({
	decks: numberOfDecks,
	deck: initialDeckData,
	creator: creatorData,
	sections: sectionData,
	cards: cardData,
	topics: topicData
}) => {
	const content = useRef<HTMLDivElement | null>(null)

	const initialDeck = useMemo(() => new Deck(initialDeckData), [
		initialDeckData
	])
	const creator = useMemo(() => new User(creatorData), [creatorData])
	const sections = useMemo(() => sectionData.map(data => new Section(data)), [
		sectionData
	])
	const cards: Record<string, Card[]> = useMemo(
		() =>
			groupBy(
				cardData.map(data => new Card(data)),
				'sectionId'
			),
		[cardData]
	)
	const allTopics = useMemo(() => topicData.map(data => new Topic(data)), [
		topicData
	])

	const { query, asPath: path } = useRouter()
	const { slugId } = query as DeckPageQuery

	const { deck: nextDeck, hasDeck } = useDeck(slugId)
	const deck = nextDeck ?? initialDeck

	const image = deck.imageUrl ?? DEFAULT_OG_IMAGE

	const topics = useMemo(
		() => allTopics.filter(({ id }) => deck.topics.includes(id)),
		[allTopics, deck]
	)
	const similarDecks = useSimilarDecks(deck, SIMILAR_DECKS_CHUNK_SIZE)

	const description =
		deck.description ||
		`${deck.averageRating.toFixed(1)} star${
			deck.averageRating === 1 ? '' : 's'
		} - ${formatNumber(deck.numberOfCards)} card${
			deck.numberOfCards === 1 ? '' : 's'
		} - ${formatNumber(deck.numberOfDownloads)} download${
			deck.numberOfDownloads === 1 ? '' : 's'
		}. Get ${deck.name} on memorize.ai by ${creator.name}.`

	useEffect(() => {
		if (!content.current) return
		content.current.scrollTop = 0
	}, [content, slugId])

	return (
		<Dashboard
			ref={content}
			className={styles.root}
			sidebarClassName={styles.sidebar}
			contentClassName={styles.content}
			selection={Selection.Market}
		>
			<Head
				title={`${deck.name} | memorize.ai`}
				description={description}
				image={image}
				labels={[
					{
						name: 'Rating',
						value: deck.numberOfRatings
							? deck.averageRating.toFixed(1)
							: 'No ratings'
					},
					{
						name: 'Downloads',
						value: formatNumber(deck.numberOfDownloads)
					},
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
						url: `${BASE_URL}${path}`,
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
			<div className={styles.box}>
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

export default DeckPage
