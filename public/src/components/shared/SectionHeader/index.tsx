import React, { useState } from 'react'

import Section from '../../../models/Section'
import ToggleExpandedButton from './ToggleExpandedButton'
import { formatNumber } from '../../../utils'

import '../../../scss/components/SectionHeader/index.scss'

export default (
	{ section, isExpanded, toggleExpanded }: {
		section: Section
		isExpanded: boolean
		toggleExpanded: () => void
	}
) => {
	const [degrees, setDegrees] = useState(0)
	
	const onClick = () => {
		toggleExpanded()
		setDegrees(degrees + 180)
	}
	
	return (
		<div className="section-header default" onClick={onClick}>
			<p className="name">
				{section.name}
			</p>
			<div className="divider" />
			<p className="card-count">
				({formatNumber(section.numberOfCards)} card{section.numberOfCards === 1 ? '' : 's'})
			</p>
			<ToggleExpandedButton degrees={degrees}>
				{isExpanded}
			</ToggleExpandedButton>
		</div>
	)
}
