import React, { useState } from 'react'

import Deck from '../../models/Deck'
import Section from '../../models/Section'
import HorizontalScrollingList from './HorizontalScrollingList'
import Box from './Box'
import CreateSectionModal from './CreateSectionModal'

export default (
	{ currentDeck, currentSection, text, from }: {
		currentDeck: Deck | undefined
		currentSection: Section | undefined
		text: string
		from: string
	}
) => {
	const [isCreateSectionModalShowing, setIsCreateSectionModalShowing] = useState(false)
	
	return (
		<>
			<div className="flex mb-2">
				<h1 className="text-4xl text-white font-bold">
					Choose a section...
				</h1>
				<button
					className="uppercase"
					onClick={() => setIsCreateSectionModalShowing(true)}
				>
					Create section
				</button>
			</div>
			<HorizontalScrollingList>
				{currentDeck?.sections.map(section => (
					<Box
						key={section.id}
						href={
							`/create-card-pop-up/d/${
								currentDeck.id
							}/s/${
								section.id
							}?text=${
								encodeURIComponent(text)
							}&from=${
								encodeURIComponent(from)
							}`
						}
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
		</>
	)
}
