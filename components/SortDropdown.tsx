import { Svg } from 'react-optimized-image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import { DeckSortAlgorithm, nameForDeckSortAlgorithm } from 'models/Deck/Search'
import Dropdown, { DropdownShadow } from './Dropdown'

import sort from 'images/icons/sort.svg'

export const algorithms = Object.values(DeckSortAlgorithm).map(type => ({
	title: nameForDeckSortAlgorithm(type),
	type
}))

const SortDropdownTrigger = () => (
	<>
		<Svg src={sort} />
		<p>Sort</p>
	</>
)

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
		trigger={<SortDropdownTrigger />}
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

export default SortDropdown
