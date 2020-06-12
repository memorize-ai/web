import React, { memo, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import TimeAgo from 'javascript-time-ago'
import enLocale from 'javascript-time-ago/locale/en'
import { canonical } from 'javascript-time-ago/gradation'

import { ReviewRecapData } from './useReviewState'
import Modal from '../../shared/Modal'
import Section from '../../../models/Section'
import Data from './RecapModalData'

TimeAgo.addLocale(enLocale)

const timeAgo = new TimeAgo('en-US')

const ReviewRecapModal = (
	{ data, backUrl, isShowing, setIsShowing }: {
		data: ReviewRecapData | null
		backUrl: string
		isShowing: boolean
		setIsShowing: (isShowing: boolean) => void
	}
) => {
	const elapsed = useMemo(() => (
		data && (
			timeAgo
				.format(data.start, {
					gradation: canonical
				})
				.replace(/\s*ago\s*$/, '')
		)
	), [data])
	
	const sectionDisplay = useCallback((role: 'easiest' | 'hardest') => {
		if (!data)
			return null
		
		const section: Section | null = (data as any)[`${role}Section`]
		
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
			className="review-recap"
			isLazy={false}
			isShowing={isShowing}
			setIsShowing={setIsShowing}
		>
			<p className="emoji" role="img" /* eslint-disable-line */>😌</p>
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
			<Link to={backUrl} className="done">
				Done!
			</Link>
		</Modal>
	)
}

export default memo(ReviewRecapModal)
