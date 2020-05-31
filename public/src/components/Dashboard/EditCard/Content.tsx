import React, { useState, useEffect, useMemo, useCallback, memo } from 'react'
import { useParams, useHistory, Link } from 'react-router-dom'
import Select from 'react-select'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faTrash, faCheck } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'
import _ from 'lodash'

import Deck from '../../../models/Deck'
import requiresAuth from '../../../hooks/requiresAuth'
import useCurrentUser from '../../../hooks/useCurrentUser'
import useCreatedDeck from '../../../hooks/useCreatedDeck'
import useImageUrl from '../../../hooks/useImageUrl'
import useSections from '../../../hooks/useSections'
import useCard from '../../../hooks/useCard'
import useLocalStorageBoolean from '../../../hooks/useLocalStorageBoolean'
import Head from '../../shared/Head'
import CKEditor from '../../shared/CKEditor'
import Loader from '../../shared/Loader'
import ConfirmationModal from '../../shared/Modal/Confirmation'
import { LOCAL_STORAGE_IS_CARD_EDITOR_STACKED_KEY } from '../../../constants'

import '../../../scss/components/Dashboard/EditCard.scss'

const CONFIRM_CLOSE_MESSAGE = 'Are you sure? You have unsaved changes that will be lost.'

const EditCardContent = () => {
	requiresAuth()
	
	const { slugId, slug, cardId } = useParams()
	const history = useHistory()
	
	const [currentUser] = useCurrentUser()
	
	const deck = useCreatedDeck(slugId, slug)
	const [imageUrl] = useImageUrl(deck)
	
	const _sections = useSections(deck?.id) ?? []
	const sections = useMemo(() => (
		deck
			? [deck.unsectionedSection, ..._sections]
			: _sections
	), [deck, _sections])
	
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
	
	const uploadUrl = useMemo(() => (
		deck && currentUser && deck.uploadUrl(currentUser.id)
	), [deck, currentUser])
	
	const closeUrl = `/decks/${slugId ?? ''}/${slug ?? ''}`
	const headDescription = `Edit a card in ${deck?.name ?? 'your deck'}.`
	
	const isSameContent = (
		section?.id === card?.sectionId &&
		front === card?.front &&
		back === card?.back
	)
	
	useEffect(() => {
		if (!card)
			return
		
		if (!didUpdateFromCard) {
			setFront(card.front)
			setBack(card.back)
			
			setDidUpdateFromCard(true)
		}
		
		if (!section) {
			const newSection = sections.find(({ id }) => id === card.sectionId)
			
			if (newSection)
				setSection(newSection)
		}
	}, [card, didUpdateFromCard, section, sections])
	
	useEffect(() => {
		if (isSameContent)
			return
		
		window.onbeforeunload = () => CONFIRM_CLOSE_MESSAGE
		
		return () => { window.onbeforeunload = null }
	}, [isSameContent])
	
	const close = useCallback(() => {
		history.push(closeUrl)
	}, [history, closeUrl])
	
	const save = useCallback(async () => {
		if (!(deck && card))
			return
		
		card.edit({
			deck,
			section: section ?? null,
			front,
			back
		})
		
		close()
	}, [deck, card, section, front, back, close])
	
	const deleteCard = useCallback(async () => {
		if (!(deck && card))
			return
		
		card.delete(deck)
		
		setIsDeleteModalShowing(false)
		close()
	}, [deck, card, setIsDeleteModalShowing, close])
	
	const onConfirmGoBack = useCallback(() => {
		setIsCloseModalShowing(false)
		close()
	}, [setIsCloseModalShowing, close])
	
	return (
		<>
			<Head
				title={`Edit card${deck ? ` | ${deck.name}` : ''} | memorize.ai`}
				description={headDescription}
				breadcrumbs={[
					[
						{
							name: 'Decks',
							url: 'https://memorize.ai/decks'
						},
						{
							name: deck?.name ?? 'Deck',
							url: `https://memorize.ai/decks/${deck?.slugId ?? '...'}/${deck?.slug ?? '...'}`
						},
						{
							name: 'Edit card',
							url: window.location.href
						}
					]
				]}
			/>
			<div className="header">
				<Link
					className="close"
					to={closeUrl}
					onClick={event => {
						if (isSameContent)
							return
						
						event.preventDefault()
						setIsCloseModalShowing(true)
					}}
				>
					<FontAwesomeIcon icon={faTimes} />
				</Link>
				<img src={imageUrl ?? Deck.DEFAULT_IMAGE_URL} alt="Deck" />
				<h1>Edit card</h1>
				<button
					className="save"
					disabled={!(front && back) || isSameContent}
					onClick={save}
					aria-label={
						front && back
							? isSameContent
								? 'You didn\'t change anything!'
								: undefined
							: 'Cards must have a front and a back'
					}
					data-balloon-pos="left"
				>
					Save
				</button>
				<button className="delete" onClick={() => setIsDeleteModalShowing(true)}>
					<FontAwesomeIcon icon={faTrash} />
				</button>
			</div>
			<div className="content">
				<div className={cx('box', { loading: !(card && didUpdateFromCard) })}>
					<div className="header">
						<p className="name">
							{deck?.name ?? 'Loading...'}
						</p>
						<button
							className="row-toggle"
							onClick={() => setIsEditorStacked(!isEditorStacked)}
						>
							<div className={cx('check', { on: !isEditorStacked })}>
								<FontAwesomeIcon icon={faCheck} />
							</div>
							<p>Side by side</p>
						</button>
					</div>
					<label>Choose section</label>
					<Select
						className="section-select"
						options={sections}
						getOptionLabel={_.property('name')}
						getOptionValue={_.property('id')}
						placeholder="Loading..."
						isLoading={!section}
						value={section}
						onChange={setSection as any}
					/>
					<div className={cx('sides', { row: !isEditorStacked })}>
						{card && didUpdateFromCard && uploadUrl
							? (
								<>
									<div>
										<div className="header">
											<FontAwesomeIcon
												className={cx({ valid: front })}
												icon={front ? faCheck : faTimes}
											/>
											<label>Front</label>
										</div>
										<CKEditor
											uploadUrl={uploadUrl}
											data={front}
											setData={setFront}
										/>
									</div>
									<div>
										<div className="header">
											<FontAwesomeIcon
												className={cx({ valid: back })}
												icon={back ? faCheck : faTimes}
											/>
											<label>Back</label>
										</div>
										<CKEditor
											uploadUrl={uploadUrl}
											data={back}
											setData={setBack}
										/>
									</div>
								</>
							)
							: <Loader size="24px" thickness="4px" color="#582efe" />
						}
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
		</>
	)
}

export default memo(EditCardContent)
