import { useState, useCallback, MouseEvent } from 'react'
import { Svg } from 'react-optimized-image'

import Section from 'models/Section'
import formatNumber from 'lib/formatNumber'
import ToggleExpandedButton from './ToggleExpandedButton'

import shareIcon from 'images/icons/share.svg'
import styles from './index.module.scss'

export interface SectionHeaderProps {
	section: Section
	isExpanded: boolean
	toggleExpanded(): void
	onShare(): void
}

const SectionHeader = ({
	section,
	isExpanded,
	toggleExpanded,
	onShare
}: SectionHeaderProps) => {
	const [degrees, setDegrees] = useState(0)

	const onClick = useCallback(() => {
		toggleExpanded()
		setDegrees(degrees => degrees + 180)
	}, [toggleExpanded, setDegrees])

	const share = useCallback(
		(event: MouseEvent<HTMLButtonElement>) => {
			event.stopPropagation()
			onShare()
		},
		[onShare]
	)

	return (
		<div className={styles.root} onClick={onClick}>
			<p className={styles.name}>{section.name}</p>
			<div className={styles.divider} />
			<p className={styles.cards}>
				({formatNumber(section.numberOfCards)} card
				{section.numberOfCards === 1 ? '' : 's'})
			</p>
			<ToggleExpandedButton degrees={degrees}>
				{isExpanded}
			</ToggleExpandedButton>
			{section.isUnsectioned || (
				<button className={styles.share} onClick={share}>
					<Svg className={styles.shareIcon} src={shareIcon} />
				</button>
			)}
		</div>
	)
}

export default SectionHeader
