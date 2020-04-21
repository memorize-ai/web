import React, { useState } from 'react'

import Deck from '../../../models/Deck'
import Section from '../../../models/Section'
import useCurrentUser from '../../../hooks/useCurrentUser'
import useSections from '../../../hooks/useSections'
import useExpandedSections from '../../../hooks/useExpandedSections'
import SectionContent from './SectionContent'
import ConfirmationModal from '../../shared/ConfirmationModal'
import ShareSectionModal from '../../shared/ShareSectionModal'

export default ({ deck }: { deck: Deck }) => {
	const [currentUser] = useCurrentUser()
	
	const _sections = useSections(deck.id)
	const sections = deck.numberOfUnsectionedCards > 0 || currentUser?.id === deck.creatorId
		? [deck.unsectionedSection, ..._sections]
		: _sections
	
	const [isExpanded, toggleExpanded] = useExpandedSections(deck, {
		isOwned: true,
		defaultExpanded: false
	})
	
	const [selectedSection, setSelectedSection] = useState(null as Section | null)
	const [isUnlockSectionModalShowing, setIsUnlockSectionModalShowing] = useState(false)
	const [isRenameSectionModalShowing, setIsRenameSectionModalShowing] = useState(false)
	const [isDeleteSectionModalShowing, setIsDeleteSectionModalShowing] = useState(false)
	const [isShareSectionModalShowing, setIsShareSectionModalShowing] = useState(false)
	
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
				onConfirm={() => {
					if (!(currentUser && selectedSection))
						return
					
					deck.unlockSectionForUserWithId(currentUser.id, selectedSection)
					setIsUnlockSectionModalShowing(false)
				}}
				buttonText="Unlock"
				buttonBackground="#4355f9"
				isShowing={isUnlockSectionModalShowing}
				setIsShowing={setIsUnlockSectionModalShowing}
			/>
			<ConfirmationModal
				title="Delete section"
				message={
					<>Are you sure you want to delete <span>{selectedSection?.name ?? '...'}</span>?</>
				}
				onConfirm={() => {
					if (!(deck && selectedSection))
						return
					
					selectedSection.delete(deck)
					setIsDeleteSectionModalShowing(false)
				}}
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
