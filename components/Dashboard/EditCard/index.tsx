import { useState, useEffect, useMemo, useCallback } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Select from 'react-select'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faTrash, faCheck } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'
import property from 'lodash/property'

import { EditCardQuery } from './models'
import Section from 'models/Section'
import requiresAuth from 'hooks/requiresAuth'
import useCloseMessage from 'hooks/useCloseMessage'
import useCurrentUser from 'hooks/useCurrentUser'
import useCreatedDeck from 'hooks/useCreatedDeck'
import useSections from 'hooks/useSections'
import useCard from 'hooks/useCard'
import useLocalStorageBoolean from 'hooks/useLocalStorageBoolean'
import Dashboard, {
	DashboardNavbarSelection as Selection
} from 'components/Dashboard'
import Head from 'components/Head'
import CKEditor from 'components/CKEditor'
import Loader from 'components/Loader'
import ConfirmationModal from 'components/Modal/Confirmation'
import { LOCAL_STORAGE_IS_CARD_EDITOR_STACKED_KEY } from 'lib/constants'

import { src as defaultImage } from 'images/logos/icon.jpg'
import styles from './index.module.scss'

const INITIAL_SECTIONS: Section[] = []
const CONFIRM_CLOSE_MESSAGE =
	'Are you sure? You have unsaved changes that will be lost.'

const EditCard: NextPage = () => {
	requiresAuth()

	const router = useRouter()
	const { slugId, slug, cardId } = router.query as EditCardQuery

	const [currentUser] = useCurrentUser()

	const deck = useCreatedDeck(slugId, slug)

	const namedSections = useSections(deck?.id) ?? INITIAL_SECTIONS
	const sections = useMemo(
		() => (deck ? [deck.unsectionedSection, ...namedSections] : namedSections),
		[deck, namedSections]
	)

	const card = useCard(deck?.id, cardId)
	const [didUpdateFromCard, setDidUpdateFromCard] = useState(false)

	const [section, setSection] = useState(
		sections.find(({ id }) => id === card?.sectionId)
	)
	const [front, setFront] = useState(card?.front ?? '')
	const [back, setBack] = useState(card?.back ?? '')

	const [isDeleteModalShowing, setIsDeleteModalShowing] = useState(false)
	const [isCloseModalShowing, setIsCloseModalShowing] = useState(false)

	const [isEditorStacked, setIsEditorStacked] = useLocalStorageBoolean(
		LOCAL_STORAGE_IS_CARD_EDITOR_STACKED_KEY
	)

	const uploadUrl = useMemo(
		() => deck && currentUser && deck.uploadUrl(currentUser.id),
		[deck, currentUser]
	)

	const closeUrl = `/decks/${slugId ?? 'error'}/${
		slug ? encodeURIComponent(slug) : 'error'
	}`
	const headDescription = `Edit a card in ${deck?.name ?? 'your deck'}.`

	const isSameContent =
		section?.id === card?.sectionId &&
		front === card?.front &&
		back === card?.back

	useCloseMessage(isSameContent ? null : CONFIRM_CLOSE_MESSAGE)

	useEffect(() => {
		if (!card) return

		if (!didUpdateFromCard) {
			setFront(card.front)
			setBack(card.back)

			setDidUpdateFromCard(true)
		}

		if (!section) {
			const newSection = sections.find(({ id }) => id === card.sectionId)

			if (newSection) setSection(newSection)
		}
	}, [card, didUpdateFromCard, section, sections])

	const close = useCallback(() => {
		router.push(closeUrl)
	}, [router, closeUrl])

	const save = useCallback(async () => {
		if (!(deck && card)) return

		card.edit({
			deck,
			section: section ?? null,
			front,
			back
		})

		close()
	}, [deck, card, section, front, back, close])

	const deleteCard = useCallback(async () => {
		if (!(currentUser && deck && card)) return

		card.delete(currentUser, deck)

		setIsDeleteModalShowing(false)
		close()
	}, [currentUser, deck, card, setIsDeleteModalShowing, close])

	const onConfirmGoBack = useCallback(() => {
		setIsCloseModalShowing(false)
		close()
	}, [setIsCloseModalShowing, close])

	return (
		<Dashboard
			className={styles.root}
			sidebarClassName={styles.sidebar}
			contentClassName={styles.content}
			selection={Selection.Decks}
		>
			<Head
				title={`Edit card${deck ? ` | ${deck.name}` : ''} | memorize.ai`}
				description={headDescription}
				breadcrumbs={url => [
					[
						{ name: 'Decks', url: '/decks' },
						{
							name: deck?.name ?? 'Deck',
							url: `/decks/${deck?.slugId ?? 'error'}/${
								deck ? encodeURIComponent(deck.slug) : 'error'
							}`
						},
						{ name: 'Edit card', url }
					]
				]}
			/>
			<div className={styles.header}>
				<Link href={closeUrl}>
					<a
						className={styles.close}
						onClick={event => {
							if (isSameContent) return

							event.preventDefault()
							setIsCloseModalShowing(true)
						}}
					>
						<FontAwesomeIcon className={styles.closeIcon} icon={faTimes} />
					</a>
				</Link>
				<img
					className={styles.image}
					src={deck?.imageUrl ?? defaultImage}
					alt="Deck"
				/>
				<h1 className={styles.title}>Edit card</h1>
				<button
					className={styles.save}
					disabled={!(front && back) || isSameContent}
					onClick={save}
					aria-label={
						front && back
							? isSameContent
								? "You didn't change anything!"
								: undefined
							: 'Cards must have a front and a back'
					}
					data-balloon-pos="left"
				>
					Save
				</button>
				<button
					className={styles.delete}
					onClick={() => setIsDeleteModalShowing(true)}
				>
					<FontAwesomeIcon className={styles.deleteIcon} icon={faTrash} />
				</button>
			</div>
			<div className={styles.main}>
				<div
					className={cx(styles.box, {
						[styles.loading]: !(card && didUpdateFromCard)
					})}
				>
					<div className={styles.boxHeader}>
						<p className={styles.name}>{deck?.name ?? 'Loading...'}</p>
						<button
							className={styles.rowToggle}
							onClick={() => setIsEditorStacked(!isEditorStacked)}
						>
							<div
								className={cx(styles.rowToggleCheck, {
									[styles.rowToggleOn]: !isEditorStacked
								})}
							>
								<FontAwesomeIcon
									className={styles.rowToggleCheckIcon}
									icon={faCheck}
								/>
							</div>
							<span className={styles.rowToggleText}>Side by side</span>
						</button>
					</div>
					<label className={styles.sectionLabel}>Choose section</label>
					<Select
						className={styles.section}
						options={sections}
						getOptionLabel={property('name')}
						getOptionValue={property('id')}
						placeholder="Loading..."
						isLoading={!section}
						value={section}
						// eslint-disable-next-line
						onChange={setSection as any}
					/>
					<div className={cx(styles.sides, { [styles.row]: !isEditorStacked })}>
						{card && didUpdateFromCard && uploadUrl ? (
							<>
								<div className={styles.side}>
									<div className={styles.sideHeader}>
										<FontAwesomeIcon
											className={cx(styles.sideHeaderIcon, {
												[styles.sideHeaderValid]: front
											})}
											icon={front ? faCheck : faTimes}
										/>
										<label className={styles.sideHeaderLabel}>Front</label>
									</div>
									<CKEditor
										className={styles.editor}
										uploadUrl={uploadUrl}
										data={front}
										setData={setFront}
									/>
								</div>
								<div className={styles.side}>
									<div className={styles.sideHeader}>
										<FontAwesomeIcon
											className={cx(styles.sideHeaderIcon, {
												[styles.sideHeaderValid]: back
											})}
											icon={back ? faCheck : faTimes}
										/>
										<label className={styles.sideHeaderLabel}>Back</label>
									</div>
									<CKEditor
										className={styles.editor}
										uploadUrl={uploadUrl}
										data={back}
										setData={setBack}
									/>
								</div>
							</>
						) : (
							<Loader size="24px" thickness="4px" color="#582efe" />
						)}
					</div>
				</div>
			</div>
			<ConfirmationModal
				title="Go back"
				message={CONFIRM_CLOSE_MESSAGE}
				onConfirm={onConfirmGoBack}
				buttonText="I don't care"
				buttonBackground="#e53e3e"
				isShowing={isCloseModalShowing}
				setIsShowing={setIsCloseModalShowing}
			/>
			<ConfirmationModal
				title="Delete card"
				message="Are you sure? You can't go back!"
				onConfirm={deleteCard}
				buttonText="Delete"
				buttonBackground="#e53e3e"
				isShowing={isDeleteModalShowing}
				setIsShowing={setIsDeleteModalShowing}
			/>
		</Dashboard>
	)
}

export default EditCard
