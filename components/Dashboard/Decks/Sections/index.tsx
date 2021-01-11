import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/router'

import { DecksSectionsQuery, DecksSectionsProps } from './models'
import Section from 'models/Section'
import useCurrentUser from 'hooks/useCurrentUser'
import useSections from 'hooks/useSections'
import useExpandedSections from 'hooks/useExpandedSections'
import SectionContent from '../SectionContent'
import ConfirmationModal from 'components/Modal/Confirmation'
import RenameSectionModal from 'components/Modal/RenameSection'
import ShareSectionModal from 'components/Modal/ShareSection'

const INITIAL_SECTIONS: Section[] = []

const DecksSections = ({ deck }: DecksSectionsProps) => {
	const router = useRouter()
	const { unlockSectionId } = router.query as DecksSectionsQuery

	const [currentUser] = useCurrentUser()

	const namedSections = useSections(deck.id) ?? INITIAL_SECTIONS
	const sections = useMemo(
		() =>
			deck.numberOfUnsectionedCards > 0 || currentUser?.id === deck.creatorId
				? [deck.unsectionedSection, ...namedSections]
				: namedSections,
		[deck, currentUser, namedSections]
	)

	const [isExpanded, toggleExpanded] = useExpandedSections(deck, {
		isOwned: true,
		defaultExpanded: false
	})

	const [selectedSection, setSelectedSection] = useState(null as Section | null)
	const [
		isUnlockSectionModalShowing,
		_setIsUnlockSectionModalShowing
	] = useState(false)
	const [
		isRenameSectionModalShowing,
		setIsRenameSectionModalShowing
	] = useState(false)
	const [
		isDeleteSectionModalShowing,
		setIsDeleteSectionModalShowing
	] = useState(false)
	const [isShareSectionModalShowing, setIsShareSectionModalShowing] = useState(
		false
	)

	const backToBaseUrl = useCallback(() => {
		router.replace(`/decks/${deck.slugId}/${encodeURIComponent(deck.slug)}`)
	}, [router, deck])

	const setIsUnlockSectionModalShowing = useCallback(
		(isShowing: boolean) => {
			_setIsUnlockSectionModalShowing(isShowing)

			if (!isShowing && unlockSectionId) backToBaseUrl()
		},
		[unlockSectionId, backToBaseUrl]
	)

	useEffect(() => {
		if (!unlockSectionId || selectedSection) return

		const section = sections.find(({ id }) => id === unlockSectionId)

		if (!section) return

		if (deck.isSectionUnlocked(section)) return backToBaseUrl()

		setSelectedSection(section)
		setIsUnlockSectionModalShowing(true)
	}, [
		unlockSectionId,
		selectedSection,
		sections,
		deck,
		backToBaseUrl,
		setIsUnlockSectionModalShowing
	])

	const onConfirmUnlock = useCallback(() => {
		if (!(currentUser && selectedSection)) return

		deck.unlockSectionForUserWithId(currentUser.id, selectedSection)
		setIsUnlockSectionModalShowing(false)
	}, [currentUser, selectedSection, deck, setIsUnlockSectionModalShowing])

	const onConfirmDelete = useCallback(() => {
		if (!(deck && selectedSection)) return

		selectedSection.delete(deck)
		setIsDeleteSectionModalShowing(false)
	}, [deck, selectedSection, setIsDeleteSectionModalShowing])

	return (
		<>
			{sections.map(section => (
				<SectionContent
					key={section.id}
					deck={deck}
					section={section}
					isExpanded={isExpanded(section.id)}
					toggleExpanded={() => toggleExpanded(section.id)}
					setSelectedSection={action => {
						setSelectedSection(section)

						switch (action) {
							case 'unlock':
								setIsUnlockSectionModalShowing(true)
								break
							case 'rename':
								setIsRenameSectionModalShowing(true)
								break
							case 'delete':
								setIsDeleteSectionModalShowing(true)
								break
							case 'share':
								setIsShareSectionModalShowing(true)
								break
						}
					}}
					numberOfSections={namedSections.length}
					reorder={delta => {
						deck.reorderSection(namedSections, section, delta)
					}}
				/>
			))}
			<ConfirmationModal
				title="Unlock section"
				message={
					<>
						Are you sure you want to unlock{' '}
						<b>{selectedSection?.name ?? '...'}</b>?
					</>
				}
				onConfirm={onConfirmUnlock}
				buttonText="Unlock"
				buttonBackground="#4355f9"
				isShowing={isUnlockSectionModalShowing}
				setIsShowing={setIsUnlockSectionModalShowing}
			/>
			<RenameSectionModal
				deck={deck}
				section={selectedSection}
				isShowing={isRenameSectionModalShowing}
				setIsShowing={setIsRenameSectionModalShowing}
			/>
			<ConfirmationModal
				title="Delete section"
				message={
					<>
						Are you sure you want to delete{' '}
						<b>{selectedSection?.name ?? '...'}</b>?
					</>
				}
				onConfirm={onConfirmDelete}
				buttonText="Delete"
				buttonBackground="#e53e3e"
				isShowing={isDeleteSectionModalShowing}
				setIsShowing={setIsDeleteSectionModalShowing}
			/>
			<ShareSectionModal
				deck={deck}
				section={selectedSection}
				isShowing={isShareSectionModalShowing}
				setIsShowing={setIsShareSectionModalShowing}
			/>
		</>
	)
}

export type { DecksSectionsProps }
export default DecksSections
