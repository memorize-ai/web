import React from 'react'
import cx from 'classnames'

export default (
	{ title, isSelected, onSelect }: {
		title: string
		isSelected: boolean
		onSelect: () => void
	}
) => (
	<button
		className={cx({ selected: isSelected })}
		onClick={onSelect}
	>
		{title}
	</button>
)
