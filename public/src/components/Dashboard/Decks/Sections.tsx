import React, { useState } from 'react'

import Deck from '../../../models/Deck'
import Section from '../../../models/Section'
import useSections from '../../../hooks/useSections'
import useExpandedSections from '../../../hooks/useExpandedSections'
import SectionContent from './SectionContent'
import UnlockSectionModal from '../../shared/UnlockSectionModal'
import ShareSectionModal from '../../shared/ShareSectionModal'

export default ({ deck }: { deck: Deck }) => {
	const sections = [deck.unsectionedSection, ...useSections(deck.id)]
	const [isExpanded, toggleExpanded] = useExpandedSections(deck, {
		isOwned: true,
		defaultExpanded: false
	})
	
	const [selectedSection, setSelectedSection] = useState(null as Section | null)
	const [isUnlockSectionModalShowing, setIsUnlockSectionModalShowing] = useState(false)
	const [isShareSectionModalShowing, setIsShareSectionModalShowing] = useState(false)
	
	return (
		<>
			{sections.map(section => (
				<SectionContent
					deck={deck}
					key={section.id}
					section={section}
					isExpanded={isExpanded(section.id)}
					toggleExpanded={() => toggleExpanded(section.id)}
					setSelectedSection={action => {
						setSelectedSection(section)
						
						switch (action) {
							case 'unlock':
								setIsUnlockSectionModalShowing(true)
								break
							case 'share':
								setIsShareSectionModalShowing(true)
								break
						}
					}}
				/>
			))}
			<UnlockSectionModal
				deck={deck}
				section={selectedSection}
				isShowing={isUnlockSectionModalShowing}
				setIsShowing={setIsUnlockSectionModalShowing}
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
