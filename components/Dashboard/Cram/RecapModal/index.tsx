import { useMemo, useCallback } from 'react'
import Link from 'next/link'
import TimeAgo from 'javascript-time-ago'
import enLocale from 'javascript-time-ago/locale/en'
import { canonical } from 'javascript-time-ago/gradation'

import { CramRecapData } from '../useCramState'
import Modal from 'components/Modal'
import Section from 'models/Section'
import Data from '../RecapModalData'

import styles from './index.module.scss'

TimeAgo.addLocale(enLocale)
const timeAgo = new TimeAgo('en-US')

export interface CramRecapModalProps {
	data: CramRecapData | null
	backUrl: string
	isShowing: boolean
	setIsShowing(isShowing: boolean): void
}

const CramRecapModal = ({
	data,
	backUrl,
	isShowing,
	setIsShowing
}: CramRecapModalProps) => {
	const elapsed = useMemo(
		() =>
			data &&
			timeAgo
				.format(data.start, { gradation: canonical })
				.replace(/\s*ago\s*$/, ''),
		[data]
	)

	const sectionDisplay = useCallback(
		(role: 'easiest' | 'hardest') => {
			if (!data) return null

			const section = ((data as unknown) as Record<string, Section | null>)[
				`${role}Section`
			]

			return section && !data.isSameSection ? (
				<Data title={`${role} section`}>
					<span className={styles.section}>{section.name}</span>{' '}
					<span className={styles.count}>
						({section.numberOfCards} card
						{section.numberOfCards === 1 ? '' : 's'})
					</span>
				</Data>
			) : null
		},
		[data]
	)

	return (
		<Modal
			className={styles.root}
			isShowing={isShowing}
			setIsShowing={setIsShowing}
		>
			<span className={styles.emoji} role="img" aria-hidden>
				😌
			</span>
			<Data title="XP">
				You earned <span className={styles.data}>{data?.xpGained || 'no'}</span>{' '}
				xp{data?.xpGained ? '!' : ''}
			</Data>
			<Data title="Time">
				You mastered{' '}
				<span className={styles.data}>
					{data?.masteredCount || 'no'} card
					{data?.masteredCount === 1 ? '' : 's'}
				</span>{' '}
				in <span className={styles.data}>{elapsed}</span>
			</Data>
			{sectionDisplay('easiest')}
			{sectionDisplay('hardest')}
			<Link href={backUrl}>
				<a className={styles.done}>Done!</a>
			</Link>
		</Modal>
	)
}

export default CramRecapModal
