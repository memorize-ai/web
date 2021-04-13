import { useCallback, Fragment } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

import Deck from 'models/Deck'
import Section from 'models/Section'
import useCurrentUser from 'hooks/useCurrentUser'
import SectionHeader from 'components/SectionHeader/Owned'
import useCards from 'hooks/useCards'
import CardCell from 'components/CardCell/Owned'
import Ad from 'components/Ad'
import Loader from 'components/Loader'

import styles from './index.module.scss'

const AD_INTERVAL = 5

export type SetSelectedSectionAction = 'unlock' | 'rename' | 'delete' | 'share'

export interface DecksSectionContentProps {
	deck: Deck
	section: Section
	isExpanded: boolean
	toggleExpanded(): void
	setSelectedSection(action: SetSelectedSectionAction): void
	numberOfSections: number
	reorder(delta: number): void
}

const DecksSectionContent = ({
	deck,
	section,
	isExpanded,
	toggleExpanded,
	setSelectedSection,
	numberOfSections,
	reorder
}: DecksSectionContentProps) => {
	const [currentUser] = useCurrentUser()
	const cards = useCards(deck, section, isExpanded)

	const addUrl = `/decks/${deck.slugId}/${encodeURIComponent(deck.slug)}/add${
		section.isUnsectioned ? '' : `/${section.id}`
	}`

	const onUnlock = useCallback(() => setSelectedSection('unlock'), [
		setSelectedSection
	])

	const onRename = useCallback(() => setSelectedSection('rename'), [
		setSelectedSection
	])

	const onDelete = useCallback(() => setSelectedSection('delete'), [
		setSelectedSection
	])

	const onShare = useCallback(() => setSelectedSection('share'), [
		setSelectedSection
	])

	return (
		<div className={styles.root}>
			<SectionHeader
				deck={deck}
				section={section}
				isExpanded={isExpanded}
				toggleExpanded={toggleExpanded}
				onUnlock={onUnlock}
				onRename={onRename}
				onDelete={onDelete}
				onShare={onShare}
				numberOfSections={numberOfSections}
				reorder={reorder}
			/>
			{currentUser?.id === deck.creatorId && (
				<div className={styles.addCards}>
					<Link href={addUrl}>
						<a className={styles.addCardsLink}>
							<FontAwesomeIcon className={styles.addCardsIcon} icon={faPlus} />
							<span className={styles.addCardsText}>
								Add cards to <i>{section.name}</i>
							</span>
						</a>
					</Link>
				</div>
			)}
			{isExpanded &&
				(!cards || cards.length > 0) &&
				(cards ? (
					<div className={styles.cards}>
						{cards.map((card, index) => (
							<Fragment key={card.id}>
								<CardCell className={styles.card} deck={deck} card={card} />
								{!((index + 1) % AD_INTERVAL) && (
									<Ad
										className={styles.ad}
										format="fluid"
										layout="-ex+7+7g-qs+mc"
										slot="4119250740"
									/>
								)}
							</Fragment>
						))}
					</div>
				) : (
					<Loader
						className={styles.loader}
						size="24px"
						thickness="4px"
						color="#582efe"
					/>
				))}
		</div>
	)
}

export default DecksSectionContent
