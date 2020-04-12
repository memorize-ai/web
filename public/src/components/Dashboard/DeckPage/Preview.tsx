import React, { useState, useEffect, useCallback } from 'react'
import Select from 'react-select'
import cx from 'classnames'
import _ from 'lodash'

import Deck from '../../../models/Deck'
import Section from '../../../models/Section'
import Card from '../../../models/Card'
import useAllCards from '../../../hooks/useAllCards'
import useSections from '../../../hooks/useSections'

import { ReactComponent as ToggleIcon } from '../../../images/icons/toggle.svg'
import { ReactComponent as LeftArrowHead } from '../../../images/icons/gray-left-arrow-head.svg'
import { ReactComponent as RightArrowHead } from '../../../images/icons/gray-right-arrow-head.svg'
import { formatNumber } from '../../../utils'

export default ({ deck }: { deck: Deck }) => {
	const _sections = [deck.unsectionedSection, ...useSections(deck.id)]
	const sections = _.keyBy(_sections, 'id')
	
	const _cards = useAllCards(deck.id)
	const cards = _cards && _.chain(_cards)
		.toPairs()
		.sort(([a], [b]) =>
			sections[a].index - sections[b].index
		)
		.map('1')
		.flatten()
		.value()
	
	const [card, setCard] = useState(null as Card | null)
	
	const [isFront, setIsFront] = useState(true)
	const [toggleButtonDegrees, setToggleButtonDegrees] = useState(0)
	
	const section = card && sections[card.sectionId ?? '']
	const cardIndex = cards?.findIndex(({ id }) => id === card?.id)
	
	const setSection = useCallback((section: Section) => {
		const newCard = cards?.find(card => card.sectionId === section.id)
		newCard && setCard(newCard)
	}, [cards])
	
	const incrementIndex = (increment: number) => {
		if (cardIndex !== undefined)
			setCard(cards![cardIndex + increment])
	}
	
	useEffect(() => {
		if (card || !cards)
			return
		
		if (deck.numberOfUnsectionedCards > 0)
			return setSection(deck.unsectionedSection)
		
		let i = -1
		
		for (const section of _sections) {
			if (section.index !== i++)
				return // The sections aren't in order, which means they haven't all been loaded
			
			if (section.numberOfCards > 0)
				return setSection(section)
		}
	}, [card, cards, deck, _sections, setSection])
	
	return (
		<div className="preview">
			<div>
				<Select
					className="section-select"
					options={_sections}
					getOptionLabel={_.property('name')}
					getOptionValue={_.property('id')}
					isOptionDisabled={section => !section.numberOfCards}
					placeholder="Loading..."
					isLoading={!section}
					value={section}
					onChange={setSection as any}
				/>
				<button
					className="box"
					onClick={() => {
						setIsFront(!isFront)
						setToggleButtonDegrees(toggleButtonDegrees + 360)
					}}
				>
					{card && (
						<div
							className="content"
							dangerouslySetInnerHTML={{
								__html: card[isFront ? 'front' : 'back']
							}}
						/>
					)}
					<div className="toggle">
						<p className="side">
							{isFront ? 'Front' : 'Back'}
						</p>
						<ToggleIcon
							className="toggle-button"
							style={{
								transform: `scale(${toggleButtonDegrees}deg)`
							}}
						/>
					</div>
				</button>
				<div className="footer">
					<button
						className="left"
						disabled={!cardIndex}
						onClick={() => incrementIndex(-1)}
					>
						<LeftArrowHead />
					</button>
					<p className={cx('progress', { disabled: cardIndex === undefined })}>
						{formatNumber((cardIndex ?? 0) + 1)} <span>/</span> {formatNumber(deck.numberOfCards)}
					</p>
					<button
						className="right"
						disabled={cardIndex === undefined || cardIndex >= cards!.length - 1}
						onClick={() => incrementIndex(1)}
					>
						<RightArrowHead />
					</button>
				</div>
			</div>
		</div>
	)
}
