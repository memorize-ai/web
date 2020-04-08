import React, { useState } from 'react'

import Deck from '../../models/Deck'
import Section from '../../models/Section'
import useSections from '../../hooks/useSections'
import { getPopUpUrl } from './Content'
import HorizontalScrollingList from './HorizontalScrollingList'
import Box from './Box'
import CreateSectionModal from './CreateSectionModal'

import '../../scss/components/CreateCardPopUp/Sections.scss'

export default (
	{ currentDeck, currentSection, text, from }: {
		currentDeck: Deck | undefined
		currentSection: Section | undefined
		text: string
		from: string
	}
) => {
	const [isCreateSectionModalShowing, setIsCreateSectionModalShowing] = useState(false)
	
	const sections = currentDeck && [
		currentDeck.unsectionedSection,
		...useSections(currentDeck?.id)
	]
	
	return (
		<div className="create-card-pop-up sections">
			<div className="header">
				<h1>Choose a section...</h1>
				<button onClick={() => setIsCreateSectionModalShowing(true)}>
					Create section
				</button>
			</div>
			<HorizontalScrollingList>
				{currentDeck && sections?.map(section => (
					<Box
						key={section.id}
						href={getPopUpUrl({
							deck: currentDeck,
							section: section.isUnsectioned ? undefined : section,
							text,
							from
						})}
						isSelected={section.id === currentSection?.id}
					>
						{section.name}
					</Box>
				))}
			</HorizontalScrollingList>
			{currentDeck && (
				<CreateSectionModal
					deck={currentDeck}
					isShowing={isCreateSectionModalShowing}
					hide={() => setIsCreateSectionModalShowing(false)}
				/>
			)}
		</div>
	)
}
