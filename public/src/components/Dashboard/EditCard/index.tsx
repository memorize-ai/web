import React, { useState, useEffect } from 'react'
import { useParams, useHistory, Link } from 'react-router-dom'
import Select from 'react-select'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faTrash } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'
import _ from 'lodash'

import Dashboard, { DashboardNavbarSelection as Selection } from '..'
import Deck from '../../../models/Deck'
import requiresAuth from '../../../hooks/requiresAuth'
import useCurrentUser from '../../../hooks/useCurrentUser'
import useDecks from '../../../hooks/useDecks'
import useImageUrl from '../../../hooks/useImageUrl'
import useSections from '../../../hooks/useSections'
import useCard from '../../../hooks/useCard'
import CKEditor from '../../shared/CKEditor'
import Loader from '../../shared/Loader'
import ConfirmationModal from '../../shared/Modal/Confirmation'

import '../../../scss/components/Dashboard/EditCard.scss'

const CONFIRM_CLOSE_MESSAGE = 'Are you sure? You have unsaved changes that will be lost.'

export default () => {
	requiresAuth()
	
	const { slugId, slug, cardId } = useParams()
	const history = useHistory()
	
	const [currentUser] = useCurrentUser()
	const deck = useDecks().find(deck =>
		deck.slugId === slugId && deck.creatorId === currentUser?.id
	)
	
	const [imageUrl] = useImageUrl(deck)
	
	const _sections = useSections(deck?.id)
	const sections = deck
		? [deck.unsectionedSection, ..._sections]
		: _sections
	
	const card = useCard(deck?.id, cardId)
	const [didUpdateFromCard, setDidUpdateFromCard] = useState(false)
	
	const [section, setSection] = useState(
		sections.find(({ id }) => id === card?.sectionId)
	)
	const [front, setFront] = useState(card?.front ?? '')
	const [back, setBack] = useState(card?.back ?? '')
	
	const [isDeleteModalShowing, setIsDeleteModalShowing] = useState(false)
	const [isCloseModalShowing, setIsCloseModalShowing] = useState(false)
	
	const closeUrl = `/decks/${slugId ?? ''}/${slug ?? ''}`
	const isSameContent = front === card?.front && back === card?.back
	
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
	
	const close = () =>
		history.push(closeUrl)
	
	const save = async () => {
		if (!(deck && card))
			return
		
		card.edit({
			deck,
			section: section ?? null,
			front,
			back
		})
		
		close()
	}
	
	const deleteCard = async () => {
		if (!(deck && card))
			return
		
		card.delete(deck)
		
		setIsDeleteModalShowing(false)
		close()
	}
	
	return (
		<Dashboard
			selection={Selection.Decks}
			className="edit-card"
			gradientHeight="500px"
		>
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
				>
					Save
				</button>
				<button className="delete" onClick={() => setIsDeleteModalShowing(true)}>
					<FontAwesomeIcon icon={faTrash} />
				</button>
			</div>
			<div className="content">
				<div className={cx('box', { loading: !(card && didUpdateFromCard) })}>
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
					{card && didUpdateFromCard
						? (
							<>
								<CKEditor data={front} setData={setFront} />
								<CKEditor data={back} setData={setBack} />
							</>
						)
						: <Loader size="24px" thickness="4px" color="#582efe" />
					}
				</div>
			</div>
			<ConfirmationModal
				title="Go back"
				message={CONFIRM_CLOSE_MESSAGE}
				onConfirm={() => {
					setIsCloseModalShowing(false)
					close()
				}}
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
