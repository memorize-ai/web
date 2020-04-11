import React, { useState } from 'react'
import _ from 'lodash'

import Deck from '../../../models/Deck'
import useSections from '../../../hooks/useSections'
import { formatNumber } from '../../../utils'

export const COLLAPSED_SECTION_LIMIT = 8

export default ({ deck }: { deck: Deck }) => {
	const _sections = useSections(deck.id)
	const [isExpanded, setIsExpanded] = useState(false)
	
	const sections = isExpanded
		? _sections
		: _.take(_sections, COLLAPSED_SECTION_LIMIT)
	
	const chunks = _.chunk(sections, Math.ceil(sections.length / 2))
	
	const rowsForColumn = (column: number) =>
		(chunks[column] ?? []).map(section => (
			<div key={section.id}>
				<p className="name">
					{section.name}
				</p>
				<div className="spacer" />
				<p className="card-count">
					({formatNumber(section.numberOfCards)} card{section.numberOfCards === 1 ? '' : 's'})
				</p>
			</div>
		))
	
	const rowsForColumn1 = rowsForColumn(0)
	const rowsForColumn2 = rowsForColumn(1)
	
	return (
		<div id="sections" className="sections">
			<h2 className="title">
				Sections <span>({formatNumber(sections.length)})</span>
			</h2>
			<div className="box">
				{sections.length
					? (
						<div className="columns">
							<div className="column">
								{rowsForColumn1}
							</div>
							{rowsForColumn2.length === 0 || (
								<div className="column">
									{rowsForColumn2}
								</div>
							)}
						</div>
					)
					: (
						<p className="no-sections-message">
							No sections
						</p>
					)
				}
				{_sections.length > COLLAPSED_SECTION_LIMIT && (
					<button
						className="toggle-expanded-button"
						onClick={() => setIsExpanded(!isExpanded)}
					>
						{isExpanded
							? 'Hide'
							: `Show ${formatNumber(_sections.length - sections.length)} more`
						}
					</button>
				)}
			</div>
		</div>
	)
}
