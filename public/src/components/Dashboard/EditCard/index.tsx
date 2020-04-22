import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faTrash } from '@fortawesome/free-solid-svg-icons'

import Dashboard, { DashboardNavbarSelection as Selection } from '..'
import LoadingState from '../../../models/LoadingState'
import requiresAuth from '../../../hooks/requiresAuth'
import Button from '../../shared/Button'
import CKEditor from '../../shared/CKEditor'

import '../../../scss/components/Dashboard/EditCard.scss'

export default () => {
	requiresAuth()
	
	const { slugId, slug, cardId } = useParams()
	
	const [front, setFront] = useState('')
	const [back, setBack] = useState('')
	
	const [saveLoadingState, setSaveLoadingState] = useState(LoadingState.None)
	const [deleteLoadingState, setDeleteLoadingState] = useState(LoadingState.None)
	
	const closeUrl = `/decks/${slugId ?? ''}/${slug ?? ''}`
	
	const save = () => {
		console.log('edit')
	}
	
	const deleteCard = () => {
		console.log('delete')
	}
	
	return (
		<Dashboard
			selection={Selection.Decks}
			className="edit-card"
			gradientHeight="500px"
		>
			<div className="header">
				<Link to={closeUrl} className="close">
					<FontAwesomeIcon icon={faTimes} />
				</Link>
				<h1>Edit card</h1>
				<Button
					className="save"
					loaderSize="16px"
					loaderThickness="3px"
					loaderColor="#582efe"
					loading={saveLoadingState === LoadingState.Loading}
					disabled={!(front && back)}
					onClick={save}
				>
					Save
				</Button>
				<Button
					className="delete"
					loaderSize="16px"
					loaderThickness="3px"
					loaderColor="#582efe"
					loading={deleteLoadingState === LoadingState.Loading}
					onClick={deleteCard}
				>
					<FontAwesomeIcon icon={faTrash} />
				</Button>
			</div>
			<div className="content">
				<div className="box">
					<CKEditor data={front} setData={setFront} />
					<CKEditor data={back} setData={setBack} />
				</div>
			</div>
		</Dashboard>
	)
}
