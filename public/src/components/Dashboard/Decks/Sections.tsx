import React, { useState, useEffect, useMemo, useCallback, memo } from 'react'
import { useParams, useHistory } from 'react-router-dom'

import Deck from '../../../models/Deck'
import Section from '../../../models/Section'
import useCurrentUser from '../../../hooks/useCurrentUser'
import useSections from '../../../hooks/useSections'
import useExpandedSections from '../../../hooks/useExpandedSections'
import SectionContent from './SectionContent'
import ConfirmationModal from '../../shared/Modal/Confirmation'
import RenameSectionModal from '../../shared/Modal/RenameSection'
import ShareSectionModal from '../../shared/Modal/ShareSection'

const DecksSections = memo(({ deck }: { deck: Deck }) => {
	const { unlockSectionId } = useParams()
	const history = useHistory()
	
	const [currentUser] = useCurrentUser()
	
	const _sections = useSections(deck.id) ?? []
	
	const sections = useMemo(() => (
		deck.numberOfUnsectionedCards > 0 || currentUser?.id === deck.creatorId
			? [deck.unsectionedSection, ..._sections]
			: _sections
	), [deck, currentUser, _sections])
	
	const [isExpanded, toggleExpanded] = useExpandedSections(deck, {
		isOwned: true,
		defaultExpanded: false
	})
	
	const [selectedSection, setSelectedSection] = useState(null as Section | null)
	const [isUnlockSectionModalShowing, _setIsUnlockSectionModalShowing] = useState(false)
	const [isRenameSectionModalShowing, setIsRenameSectionModalShowing] = useState(false)
	const [isDeleteSectionModalShowing, setIsDeleteSectionModalShowing] = useState(false)
	const [isShareSectionModalShowing, setIsShareSectionModalShowing] = useState(false)
	
	const backToBaseUrl = useCallback(() => (
		history.replace(`/decks/${deck.slugId}/${deck.slug}`)
	), [deck])
	
	const setIsUnlockSectionModalShowing = useCallback((isShowing: boolean) => {
		_setIsUnlockSectionModalShowing(isShowing)
		
		if (!isShowing && unlockSectionId)
			backToBaseUrl()
	}, [unlockSectionId, backToBaseUrl])
	
	useEffect(() => {
		if (!unlockSectionId || selectedSection)
			return
		
		const section = sections.find(({ id }) => id === unlockSectionId)
		
		if (!section)
			return
		
		if (deck.isSectionUnlocked(section))
			return backToBaseUrl()
		
		setSelectedSection(section)
		setIsUnlockSectionModalShowing(true)
	}, [unlockSectionId, selectedSection, sections, deck, backToBaseUrl, setIsUnlockSectionModalShowing])
	
	const onConfirmUnlock = useCallback(() => {
		if (!(currentUser && selectedSection))
			return
		
		deck.unlockSectionForUserWithId(currentUser.id, selectedSection)
		setIsUnlockSectionModalShowing(false)
	}, [currentUser, selectedSection, deck, setIsUnlockSectionModalShowing])
	
	const onConfirmDelete = useCallback(() => {
		if (!(deck && selectedSection))
			return
		
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
					numberOfSections={_sections.length}
					reorder={delta => {
						deck.reorderSection(_sections, section, delta)
					}}
				/>
			))}
			<ConfirmationModal
				title="Unlock section"
				message={
					<>Are you sure you want to unlock <span>{selectedSection?.name ?? '...'}</span>?</>
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
					<>Are you sure you want to delete <span>{selectedSection?.name ?? '...'}</span>?</>
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
})

export default DecksSections
