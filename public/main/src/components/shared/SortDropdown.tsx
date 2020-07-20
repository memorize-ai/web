import React, { memo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import { DeckSortAlgorithm, nameForDeckSortAlgorithm } from '../../models/Deck/Search'
import Dropdown, { DropdownShadow } from './Dropdown'

import { ReactComponent as SortIcon } from '../../images/icons/sort.svg'

import '../../scss/components/SortDropdown.scss'

export const algorithms = Object.values(DeckSortAlgorithm).map(type => ({
	title: nameForDeckSortAlgorithm(type),
	type
}))

const SortDropdown = (
	{ shadow, isShowing, setIsShowing, algorithm, setAlgorithm }: {
		shadow: DropdownShadow
		isShowing: boolean
		setIsShowing: (isShowing: boolean) => void
		algorithm: DeckSortAlgorithm
		setAlgorithm: (algorithm: DeckSortAlgorithm) => void
	}
) => (
	<Dropdown
		className="sort-dropdown"
		shadow={shadow}
		trigger={
			<>
				<SortIcon />
				<p>Sort</p>
			</>
		}
		isShowing={isShowing}
		setIsShowing={setIsShowing}
	>
		{algorithms.map(({ title, type }) => {
			const selected = algorithm === type
			
			return (
				<button
					key={type}
					className={cx({ selected })}
					onClick={() => setAlgorithm(type)}
				>
					{selected && <FontAwesomeIcon icon={faCheck} />}
					<p>{title}</p>
				</button>
			)
		})}
	</Dropdown>
)

export default memo(SortDropdown)
