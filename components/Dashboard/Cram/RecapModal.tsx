import { useMemo, useCallback } from 'react'
import Link from 'next/link'
import TimeAgo from 'javascript-time-ago'
import enLocale from 'javascript-time-ago/locale/en'
import { canonical } from 'javascript-time-ago/gradation'

import { CramRecapData } from './useCramState'
import Modal from 'components/Modal'
import Section from 'models/Section'
import Data from './RecapModalData'

TimeAgo.addLocale(enLocale)
const timeAgo = new TimeAgo('en-US')

const CramRecapModal = (
	{ data, backUrl, isShowing, setIsShowing }: {
		data: CramRecapData | null
		backUrl: string
		isShowing: boolean
		setIsShowing: (isShowing: boolean) => void
	}
) => {
	const elapsed = useMemo(() => (
		data && timeAgo
			.format(data.start, { gradation: canonical })
			.replace(/\s*ago\s*$/, '')
	), [data])
	
	const sectionDisplay = useCallback((role: 'easiest' | 'hardest') => {
		if (!data)
			return null
		
		const section: Section | null = data[`${role}Section`]
		
		return section && !data.isSameSection
			? (
				<Data title={`${role} section`}>
					<span className="section-name">
						{section.name}
					</span> <span className="section-card-count">
						({
							section.numberOfCards
						} card{
							section.numberOfCards === 1 ? '' : 's'
						})
					</span>
				</Data>
			)
			: null
	}, [data])
	
	return (
		<Modal
			className="cram-recap"
			isLazy={false}
			isShowing={isShowing}
			setIsShowing={setIsShowing}
		>
			<p className="emoji" role="img">😌</p>
			<Data title="XP">
				You earned <span>
					{data?.xpGained || 'no'}
				</span> xp{
					data?.xpGained ? '!' : ''
				}
			</Data>
			<Data title="Time">
				You mastered <span>
					{
						data?.masteredCount || 'no'
					} card{
						data?.masteredCount === 1 ? '' : 's'
					}
				</span> in <span>{elapsed}</span>
			</Data>
			{sectionDisplay('easiest')}
			{sectionDisplay('hardest')}
			<Link href={backUrl}>
				<a className="done">Done!</a>
			</Link>
		</Modal>
	)
}

export default CramRecapModal
