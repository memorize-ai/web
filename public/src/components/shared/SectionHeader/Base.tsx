import React from 'react'
import cx from 'classnames'

import Section from '../../../models/Section'

export interface SectionHeaderProps {
	section: Section
	isExpanded: boolean
	toggleIsExpanded: () => void
}

export default ({
	className,
	section,
	isExpanded,
	toggleIsExpanded
}: SectionHeaderProps & { className: string }) => (
	<div className={cx('section-header', className)}>
		<p className="name">
			{section.name}
		</p>
		<button onClick={toggleIsExpanded}>
			{isExpanded ? 'Collapse' : 'Expand'}
		</button>
	</div>
)
