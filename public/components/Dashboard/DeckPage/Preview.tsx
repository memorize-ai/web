import React, { useState, useEffect, useCallback, useMemo } from 'react'
import Select from 'react-select'
import cx from 'classnames'
import _ from 'lodash'

import Deck from 'models/Deck'
import Section from 'models/Section'
import Card from 'models/Card'
import useSections from 'hooks/useSections'
import useAllCards from 'hooks/useAllCards'
import useKeyPress from 'hooks/useKeyPress'
import CardSide from 'components/shared/CardSide'
import Loader from 'components/shared/Loader'
import { sleep, formatNumber } from 'lib/utils'

import ToggleIcon from '../../../images/icons/toggle.svg'
import LeftArrowHead from '../../../images/icons/gray-left-arrow-head.svg'
import RightArrowHead from '../../../images/icons/gray-right-arrow-head.svg'

const BOX_TRANSFORM_X_LENGTH = 20

export default ({ deck }: { deck: Deck }) => {
	const __sections = useSections(deck.id)
	
	const _sections = useMemo(() => (
		__sections && [
			deck.unsectionedSection,
			...__sections
		]
	), [deck, __sections])
	
	const sections = useMemo(() => (
		_.keyBy(_sections ?? [], 'id')
	), [_sections])
	
	const _cards = useAllCards(deck.id)
	const cards = useMemo(() => (
		_cards && _.chain(_cards)
			.toPairs()
			.sort(([a], [b]) =>
				sections[a].index - sections[b].index
			)
			.map('1')
			.flatten()
			.value()
	), [_cards, sections])
	
	const [card, setCard] = useState(null as Card | null)
	
	const [isFront, setIsFront] = useState(true)
	const [toggleButtonDegrees, setToggleButtonDegrees] = useState(0)
	
	const [boxOpacity, setBoxOpacity] = useState(1)
	const [boxTransform, setBoxTransform] = useState(undefined as string | undefined)
	
	const section = card && sections[card.sectionId]
	const cardIndex = cards?.findIndex(({ id }) => id === card?.id)
	
	const shouldGoLeft = useKeyPress(37) // Left arrow
	const shouldGoRight = useKeyPress(39) // Right arrow
	
	const isLeftDisabled = !cardIndex
	const isRightDisabled = cardIndex === undefined || cardIndex >= cards!.length - 1
	
	const setSection = useCallback((section: Section) => {
		const newCard = cards?.find(card => card.sectionId === section.id)
		newCard && setCard(newCard)
	}, [cards])
	
	const toggleSide = async () => {
		setBoxOpacity(0)
		setBoxTransform('translateY(-16px)')
		
		await sleep(150)
		
		setIsFront(!isFront)
		setToggleButtonDegrees(toggleButtonDegrees + 180)
		
		setBoxOpacity(1)
		setBoxTransform(undefined)
	}
	
	const nextCard = async (isRight: boolean) => {
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
	}
	
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
	}, [card, cards, deck, _sections]) // eslint-disable-line
	
	useEffect(() => {
		if (shouldGoLeft && !isLeftDisabled)
			nextCard(false)
	}, [shouldGoLeft, isLeftDisabled]) // eslint-disable-line
	
	useEffect(() => {
		if (shouldGoRight && !isRightDisabled)
			nextCard(true)
	}, [shouldGoRight, isRightDisabled]) // eslint-disable-line
	
	return (
		<div className="preview">
			<div>
				<div className="header">
					<Select
						className="section-select"
						options={_sections ?? []}
						getOptionLabel={_.property('name')}
						getOptionValue={_.property('id')}
						isOptionDisabled={section => !section.numberOfCards}
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
