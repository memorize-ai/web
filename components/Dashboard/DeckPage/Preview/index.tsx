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

import styles from './index.module.scss'

const SHOULD_GO_LEFT_KEYS = ['ArrowLeft']
const SHOULD_GO_RIGHT_KEYS = ['ArrowRight']

const BOX_TRANSFORM_X_LENGTH = 20

export interface DeckPagePreviewProps {
	deck: Deck
	sections: Section[]
	cards: Record<string, Card[] | undefined>
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
		() => card && cards.findIndex(_card => _card?.id === card.id),
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
		<div className={styles.root}>
			<div className={styles.header}>
				<Select
					className={styles.section}
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
				<h3 className={styles.title}>Preview this deck</h3>
			</div>
			<div
				className={styles.box}
				onClick={toggleSide}
				style={{ opacity: boxOpacity, transform: boxTransform }}
			>
				<div className={styles.contentContainer}>
					<CardSide className={styles.content}>
						{card[isFront ? 'front' : 'back']}
					</CardSide>
				</div>
				<div className={styles.toggle}>
					<p className={styles.toggleSide}>{isFront ? 'Front' : 'Back'}</p>
					<Svg
						className={styles.toggleIcon}
						src={toggle}
						viewBox={`0 0 ${toggle.width} ${toggle.height}`}
						style={{
							transform: `scale(2) rotate(${toggleButtonDegrees}deg)`
						}}
					/>
				</div>
			</div>
			<div className={styles.footer}>
				<button
					className={styles.left}
					disabled={isLeftDisabled}
					onClick={() => nextCard(false)}
				>
					<Svg className={styles.directionIcon} src={leftArrowHead} />
				</button>
				<div className={styles.progress}>
					<div className={styles.slider}>
						<div
							className={styles.sliderContent}
							style={{
								width: `${(100 * (cardIndex + 1)) / deck.numberOfCards}%`
							}}
						/>
					</div>
					<p className={styles.progressText}>
						{formatNumber((cardIndex ?? 0) + 1)}{' '}
						<span className={styles.progressSlash}>/</span>{' '}
						{formatNumber(deck.numberOfCards)}
					</p>
				</div>
				<button
					className={styles.right}
					disabled={isRightDisabled}
					onClick={() => nextCard(true)}
				>
					<Svg className={styles.directionIcon} src={rightArrowHead} />
				</button>
			</div>
		</div>
	)
}

export default DeckPagePreview
