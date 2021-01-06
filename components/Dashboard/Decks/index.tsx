import { useEffect } from 'react'
import { useRouter } from 'next/router'
import cx from 'classnames'
import { ParsedUrlQuery } from 'querystring'

import LoadingState from 'models/LoadingState'
import requiresAuth from 'hooks/requiresAuth'
import useSelectedDeck from 'hooks/useSelectedDeck'
import useDecks from 'hooks/useDecks'
import Dashboard, { DashboardNavbarSelection as Selection } from 'components/Dashboard'
import Head from 'components/Head'
import Header from './Header'
import Sections from './Sections'
import Loader from 'components/Loader'

interface DecksQuery extends ParsedUrlQuery {
	slugId?: string
	slug?: string
	unlockSectionId?: string
}

const Decks = () => {
	const router = useRouter()
	const { slugId, slug, unlockSectionId } = router.query as DecksQuery
	
	requiresAuth(!unlockSectionId)
	
	const [selectedDeck, setSelectedDeck] = useSelectedDeck()
	const [decks, decksLoadingState] = useDecks()
	
	useEffect(() => {
		if (!slugId && selectedDeck)
			router.replace(`/decks/${selectedDeck.slugId}/${selectedDeck.slug}`)
	}, [slugId, selectedDeck, router])
	
	useEffect(() => {
		if (
			!(slugId && slug) ||
			selectedDeck?.slugId === slugId ||
			decksLoadingState !== LoadingState.Success
		)
			return
		
		const deck = decks.find(deck => deck.slugId === slugId)
		
		deck
			? setSelectedDeck(deck)
			: router.replace(`/d/${slugId}/${slug}`)
	}, [slugId, slug, selectedDeck, decksLoadingState, decks, router, setSelectedDeck])
	
	return (
		<Dashboard selection={Selection.Decks} className="decks">
			<Head
				title={`${selectedDeck ? `${selectedDeck.name} | ` : ''}My decks | memorize.ai`}
				description={`${selectedDeck ? `${selectedDeck.name} - ` : ''}My decks on memorize.ai.`}
				breadcrumbs={url => [
					[{ name: 'Decks', url }]
				]}
			/>
			<Header deck={selectedDeck} />
			<div className="content">
				<div className={cx('box', { loading: !selectedDeck })}>
					{selectedDeck
						? <Sections deck={selectedDeck} />
						: <Loader size="24px" thickness="4px" color="#582efe" />
					}
				</div>
			</div>
		</Dashboard>
	)
}

export default Decks
