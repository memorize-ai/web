import { useState, useEffect, useCallback, useMemo } from 'react'
import { Svg } from 'react-optimized-image'
import Select from 'react-select'
import cx from 'classnames'
import keyBy from 'lodash/keyBy'
import toPairs from 'lodash/toPairs'
import flatten from 'lodash/flatten'
import property from 'lodash/property'

import Deck from 'models/Deck'
import Section from 'models/Section'
import Card from 'models/Card'
import useKeyPress from 'hooks/useKeyPress'
import CardSide from 'components/CardSide'
import { sleep, formatNumber } from 'lib/utils'

import toggle from 'images/icons/toggle.svg'
import leftArrowHead from 'images/icons/gray-left-arrow-head.svg'
import rightArrowHead from 'images/icons/gray-right-arrow-head.svg'

const SHOULD_GO_LEFT_KEYS = ['ArrowLeft']
const SHOULD_GO_RIGHT_KEYS = ['ArrowRight']

const BOX_TRANSFORM_X_LENGTH = 20

export interface DeckPagePreviewProps {
	deck: Deck
	sections: Section[]
	cards: Record<string, Card[]>
}

const DeckPagePreview = ({
	deck,
	sections: namedSections,
	cards: cardsBySectionId
}: DeckPagePreviewProps) => {
	const sections = [deck.unsectionedSection, ...namedSections]
	const sectionsById = keyBy(sections, 'id')

	const cards = useMemo(
		() =>
			flatten(
				toPairs(cardsBySectionId)
					.sort(([a], [b]) => sectionsById[a].index - sectionsById[b].index)
					.map(([, card]) => card)
			),
		[cardsBySectionId, sectionsById]
	)

	const getCardForSection = useCallback(
		({ id }: Section) => cardsBySectionId[id]?.[0],
		[cardsBySectionId]
	)

	const [card, setCard] = useState(() => {
		const section = sections.find(section => section.numberOfCards > 0)
		return section && getCardForSection(section)
	})

	const [isFront, setIsFront] = useState(true)
	const [toggleButtonDegrees, setToggleButtonDegrees] = useState(0)

	const [boxOpacity, setBoxOpacity] = useState(1)
	const [boxTransform, setBoxTransform] = useState(
		undefined as string | undefined
	)

	const section = card && sectionsById[card.sectionId]

	const cardIndex = useMemo(
		() => card && cards.findIndex(({ id }) => id === card.id),
		[cards, card]
	)

	const shouldGoLeft = useKeyPress(SHOULD_GO_LEFT_KEYS)
	const shouldGoRight = useKeyPress(SHOULD_GO_RIGHT_KEYS)

	const isLeftDisabled = !cardIndex
	const isRightDisabled =
		cardIndex === undefined || cardIndex >= cards.length - 1

	const setSection = useCallback(
		(section: Section) => {
			const card = getCardForSection(section)
			card && setCard(card)
		},
		[getCardForSection, setCard]
	)

	const toggleSide = useCallback(async () => {
		setBoxOpacity(0)
		setBoxTransform('translateY(-16px)')

		await sleep(150)

		setIsFront(isFront => !isFront)
		setToggleButtonDegrees(toggleButtonDegrees => toggleButtonDegrees + 180)

		setBoxOpacity(1)
		setBoxTransform(undefined)
	}, [setBoxOpacity, setBoxTransform, setIsFront, setToggleButtonDegrees])

	const nextCard = useCallback(
		async (isRight: boolean) => {
			if (cardIndex === undefined) return

			const direction = isRight ? 1 : -1

			setBoxOpacity(0)
			setBoxTransform(`translateX(${direction * BOX_TRANSFORM_X_LENGTH}px)`)

			await sleep(150)

			setCard(cards[cardIndex + direction])
			setIsFront(true)

			setBoxOpacity(1)
			setBoxTransform(undefined)
		},
		[cardIndex, setBoxOpacity, setBoxTransform, setCard, cards, setIsFront]
	)

	useEffect(() => {
		if (shouldGoLeft && !isLeftDisabled) nextCard(false)
	}, [shouldGoLeft, isLeftDisabled, nextCard])

	useEffect(() => {
		if (shouldGoRight && !isRightDisabled) nextCard(true)
	}, [shouldGoRight, isRightDisabled, nextCard])

	const isSectionDisabled = useCallback(
		(section: Section) => !section.numberOfCards,
		[]
	)

	if (!(section && card) || cardIndex === undefined) return null

	return (
		<div className="preview">
			<div className="header">
				<Select
					className="section-select"
					options={sections}
					getOptionLabel={property('name')}
					getOptionValue={property('id')}
					isOptionDisabled={isSectionDisabled}
					placeholder="Loading..."
					isLoading={!section}
					value={section}
					// eslint-disable-next-line
					onChange={setSection as any}
				/>
				<h3 className="message">Preview this deck</h3>
			</div>
			<div
				className={cx('box', { loading: !card })}
				onClick={toggleSide}
				style={{ opacity: boxOpacity, transform: boxTransform }}
			>
				<div className="content-container">
					<CardSide>{card[isFront ? 'front' : 'back']}</CardSide>
				</div>
				<div className="toggle">
					<p className="side">{isFront ? 'Front' : 'Back'}</p>
					<Svg
						className="icon"
						src={toggle}
						viewBox={`0 0 ${toggle.width} ${toggle.height}`}
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
					<Svg src={leftArrowHead} />
				</button>
				<div className="progress">
					<div className="slider">
						<div
							style={{
								width: `${(100 * (cardIndex + 1)) / deck.numberOfCards}%`
							}}
						/>
					</div>
					<p>
						{formatNumber((cardIndex ?? 0) + 1)} <span>/</span>{' '}
						{formatNumber(deck.numberOfCards)}
					</p>
				</div>
				<button
					className="right"
					disabled={isRightDisabled}
					onClick={() => nextCard(true)}
				>
					<Svg src={rightArrowHead} />
				</button>
			</div>
		</div>
	)
}

export default DeckPagePreview
