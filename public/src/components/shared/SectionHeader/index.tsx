import React from 'react'

import Base, { SectionHeaderProps } from './Base'

export default ({
	section,
	isExpanded,
	toggleIsExpanded
}: SectionHeaderProps) => (
	<Base
		className="default"
		section={section}
		isExpanded={isExpanded}
		toggleIsExpanded={toggleIsExpanded}
	/>
)
