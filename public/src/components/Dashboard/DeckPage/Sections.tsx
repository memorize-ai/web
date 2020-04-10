import React, { useState } from 'react'
import _ from 'lodash'
import cx from 'classnames'

import Deck from '../../../models/Deck'
import useSections from '../../../hooks/useSections'

export const COLLAPSED_COLUMN_LIMIT = 4

export default ({ deck }: { deck: Deck }) => {
	const sections = useSections(deck.id)
	const [isExpanded, setIsExpanded] = useState(false)
	
	const chunks = _.chunk(sections, Math.ceil(sections.length / 2))
	
	const rowsForColumn = (column: number) =>
		(chunks[column] ?? []).map((section, i) => (
			<div
				key={section.id}
				className={cx({
					hidden: !(isExpanded || i < COLLAPSED_COLUMN_LIMIT)
				})}
			>
				<p className="name">
					{section.name}
				</p>
				<div className="spacer" />
				<p className="card-count">
					({section.numberOfCards} card{section.numberOfCards === 1 ? '' : 's'})
				</p>
			</div>
		))
	
	const rowsForColumn1 = rowsForColumn(0)
	const rowsForColumn2 = rowsForColumn(1)
	
	return (
		<div className="sections">
			<h2 className="title">
				Sections <span>({sections.length})</span>
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
				{sections.length > COLLAPSED_COLUMN_LIMIT * 2 && (
					<button
						className="toggle-expanded-button"
						onClick={() => setIsExpanded(!isExpanded)}
					>
						{isExpanded ? 'Hide' : `Show ${sections.length - COLLAPSED_COLUMN_LIMIT * 2} more`}
					</button>
				)}
			</div>
		</div>
	)
}
