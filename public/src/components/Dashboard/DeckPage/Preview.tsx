import React, { useState, useEffect, useCallback, useMemo } from 'react'
import Select from 'react-select'
import cx from 'classnames'
import keyBy from 'lodash/keyBy'
import toPairs from 'lodash/toPairs'
import flatten from 'lodash/flatten'
import property from 'lodash/property'

import Deck from '../../../models/Deck'
import Section from '../../../models/Section'
import Card from '../../../models/Card'
import useSections from '../../../hooks/useSections'
import useAllCards from '../../../hooks/useAllCards'
import useKeyPress from '../../../hooks/useKeyPress'
import CardSide from '../../shared/CardSide'
import Loader from '../../shared/Loader'
import { sleep, formatNumber } from '../../../utils'

import { ReactComponent as ToggleIcon } from '../../../images/icons/toggle.svg'
import { ReactComponent as LeftArrowHead } from '../../../images/icons/gray-left-arrow-head.svg'
import { ReactComponent as RightArrowHead } from '../../../images/icons/gray-right-arrow-head.svg'

const BOX_TRANSFORM_X_LENGTH = 20

const DeckPagePreview = ({ deck }: { deck: Deck }) => {
	const __sections = useSections(deck.id)
	
	const _sections = useMemo(() => (
		__sections && [
			deck.unsectionedSection,
			...__sections
		]
	), [deck, __sections])
	
	const sections = useMemo(() => (
		keyBy(_sections ?? [], 'id')
	), [_sections])
	
	const _cards = useAllCards(deck.id)
	const cards = useMemo(() => (
		_cards && flatten(
			toPairs(_cards)
				.sort(([a], [b]) =>
					sections[a].index - sections[b].index
				)
				.map(([, card]) => card)
		)
	), [_cards, sections])
	
	const [card, setCard] = useState(null as Card | null)
	
	const [isFront, setIsFront] = useState(true)
	const [toggleButtonDegrees, setToggleButtonDegrees] = useState(0)
	
	const [boxOpacity, setBoxOpacity] = useState(1)
	const [boxTransform, setBoxTransform] = useState(undefined as string | undefined)
	
	const section = card && sections[card.sectionId]
	
	const cardIndex = useMemo(() => (
		cards?.findIndex(({ id }) => id === card?.id)
	), [cards, card])
	
	const shouldGoLeft = useKeyPress(37) // Left arrow
	const shouldGoRight = useKeyPress(39) // Right arrow
	
	const isLeftDisabled = !cardIndex
	const isRightDisabled = cardIndex === undefined || cardIndex >= cards!.length - 1
	
	const setSection = useCallback((section: Section) => {
		const newCard = cards?.find(card => card.sectionId === section.id)
		newCard && setCard(newCard)
	}, [cards])
	
	const toggleSide = useCallback(async () => {
		setBoxOpacity(0)
		setBoxTransform('translateY(-16px)')
		
		await sleep(150)
		
		setIsFront(isFront => !isFront)
		setToggleButtonDegrees(toggleButtonDegrees => toggleButtonDegrees + 180)
		
		setBoxOpacity(1)
		setBoxTransform(undefined)
	}, [setBoxOpacity, setBoxTransform, setIsFront, setToggleButtonDegrees])
	
	const nextCard = useCallback(async (isRight: boolean) => {
		if (cardIndex === undefined)
			return
		
		const direction = isRight ? 1 : -1
		
		setBoxOpacity(0)
		setBoxTransform(`translateX(${direction * BOX_TRANSFORM_X_LENGTH}px)`)
		
		await sleep(150)
		
		setCard(cards![cardIndex + direction])
		setIsFront(true)
		
		setBoxOpacity(1)
		setBoxTransform(undefined)
	}, [cardIndex, setBoxOpacity, setBoxTransform, setCard, cards, setIsFront])
	
	useEffect(() => {
		if (card || !cards)
			return
		
		if (deck.numberOfUnsectionedCards > 0)
			return setSection(deck.unsectionedSection)
		
		if (!_sections)
			return
		
		for (const section of _sections)
			if (section.numberOfCards > 0)
				return setSection(section)
	}, [card, cards, deck, _sections, setSection])
	
	useEffect(() => {
		if (shouldGoLeft && !isLeftDisabled)
			nextCard(false)
	}, [shouldGoLeft, isLeftDisabled, nextCard])
	
	useEffect(() => {
		if (shouldGoRight && !isRightDisabled)
			nextCard(true)
	}, [shouldGoRight, isRightDisabled, nextCard])
	
	const isSectionDisabled = useCallback((section: Section) => (
		!section.numberOfCards
	), [])
	
	return (
		<div className="preview">
			<div>
				<div className="header">
					<Select
						className="section-select"
						options={_sections ?? []}
						getOptionLabel={property('name')}
						getOptionValue={property('id')}
						isOptionDisabled={isSectionDisabled}
						placeholder="Loading..."
						isLoading={!section}
						value={section}
						onChange={setSection as any}
					/>
					<h3 className="message">
						Preview this deck
					</h3>
				</div>
				<div
					className={cx('box', { loading: !card })}
					onClick={toggleSide}
					style={{
						opacity: boxOpacity,
						transform: boxTransform
					}}
				>
					{card
						? (
							<div className="content-container">
								<CardSide>
									{card[isFront ? 'front' : 'back']}
								</CardSide>
							</div>
						)
						: <Loader size="24px" thickness="4px" color="#582efe" />
					}
					<div className="toggle">
						<p className="side">
							{isFront ? 'Front' : 'Back'}
						</p>
						<ToggleIcon
							className="icon"
							style={{
								transform: `scale(2) rotate(${toggleButtonDegrees}deg)`
							}}
						/>
					</div>
				</div>
				<div className="footer">
					<button
						className="left"
						disabled={isLeftDisabled}
						onClick={() => nextCard(false)}
					>
						<LeftArrowHead />
					</button>
					<div className={cx('progress', { disabled: cardIndex === undefined })}>
						<div className="slider">
							<div style={{ width: `${100 * ((cardIndex ?? 0) + 1) / deck.numberOfCards}%` }} />
						</div>
						<p>{formatNumber((cardIndex ?? 0) + 1)} <span>/</span> {formatNumber(deck.numberOfCards)}</p>
					</div>
					<button
						className="right"
						disabled={isRightDisabled}
						onClick={() => nextCard(true)}
					>
						<RightArrowHead />
					</button>
				</div>
			</div>
		</div>
	)
}

export default DeckPagePreview
