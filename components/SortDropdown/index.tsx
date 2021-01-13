import { Svg } from 'react-optimized-image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import { DeckSortAlgorithm, nameForDeckSortAlgorithm } from 'models/Deck/Search'
import Dropdown, { DropdownShadow } from '../Dropdown'

import sort from 'images/icons/sort.svg'
import styles from './index.module.scss'

export const algorithms = Object.values(DeckSortAlgorithm).map(type => ({
	title: nameForDeckSortAlgorithm(type),
	type
}))

const SortDropdownTrigger = () => (
	<>
		<Svg className={styles.triggerIcon} src={sort} />
		<span className={styles.triggerText}>Sort</span>
	</>
)

export interface SortDropdownProps {
	shadow: DropdownShadow
	isShowing: boolean
	setIsShowing(isShowing: boolean): void
	algorithm: DeckSortAlgorithm
	setAlgorithm(algorithm: DeckSortAlgorithm): void
}

const SortDropdown = ({
	shadow,
	isShowing,
	setIsShowing,
	algorithm,
	setAlgorithm
}: SortDropdownProps) => (
	<Dropdown
		triggerClassName={styles.trigger}
		contentClassName={styles.content}
		shadow={shadow}
		trigger={<SortDropdownTrigger />}
		isShowing={isShowing}
		setIsShowing={setIsShowing}
	>
		{algorithms.map(({ title, type }) => {
			const isSelected = algorithm === type

			return (
				<button
					key={type}
					className={cx(styles.algorithm, {
						[styles.selectedAlgorithm]: isSelected
					})}
					onClick={() => setAlgorithm(type)}
				>
					{isSelected && (
						<FontAwesomeIcon className={styles.algorithmIcon} icon={faCheck} />
					)}
					<span>{title}</span>
				</button>
			)
		})}
	</Dropdown>
)

export default SortDropdown
