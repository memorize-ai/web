import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Link, useParams } from 'react-router-dom'
import { Heading, Box, Columns, Button } from 'react-bulma-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faLock, faCheck, faUnlock, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

import firebase from '../firebase'
import LoadingState from '../LoadingState'
import useDeck from '../hooks/useDeck'
import useSection from '../hooks/useSection'
import useCurrentUser from '../hooks/useCurrentUser'

import 'firebase/auth'
import 'firebase/firestore'
import '../scss/UnlockSection.scss'

const __DECK_NOT_OWNED__ = '__DECK_NOT_OWNED__'

const auth = firebase.auth()
const firestore = firebase.firestore()

export default () => {
	const { deckId, sectionId } = useParams()
	
	const deck = useDeck(deckId ?? '')
	const section = useSection(deckId ?? '', sectionId ?? '')
	const [currentUser, currentUserLoadingState] = useCurrentUser()
	
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	
	const [unlockLoadingState, setUnlockLoadingState] = useState(LoadingState.None)
	const [signOutLoadingState, setSignOutLoadingState] = useState(LoadingState.None)
	const [errorMessage, setErrorMessage] = useState(null as string | null)
	
	useEffect(() => void (async () => {
		if (!(currentUser && deckId && sectionId && section))
			return
		
		setUnlockLoadingState(LoadingState.Loading)
		setErrorMessage(null)
		
		try {
			const userDocument = await firestore
				.doc(`users/${currentUser.uid}/decks/${deckId}`)
				.get()
			
			if (!userDocument.exists)
				throw new Error(__DECK_NOT_OWNED__)
			
			if ((userDocument.get('sections') ?? {})[sectionId] !== undefined)
				throw new Error(`${section.name} has already been unlocked!`)
			
			await userDocument.ref.update({
				dueCardCount: firebase.firestore.FieldValue.increment(section.cardCount ?? 0),
				unlockedCardCount: firebase.firestore.FieldValue.increment(section.cardCount ?? 0),
				[`sections.${sectionId}`]: section.cardCount ?? 0
			})
			
			setUnlockLoadingState(LoadingState.Success)
			setErrorMessage(null)
		} catch (error) {
			setUnlockLoadingState(LoadingState.Fail)
			setErrorMessage(error.message)
		}
	})(), [currentUser, deckId, sectionId, section])
	
	const signOut = async () => {
		setUnlockLoadingState(LoadingState.None)
		setSignOutLoadingState(LoadingState.Loading)
		setErrorMessage(null)
		
		try {
			await auth.signOut()
			
			setSignOutLoadingState(LoadingState.Success)
			setErrorMessage(null)
		} catch (error) {
			setSignOutLoadingState(LoadingState.Fail)
			setErrorMessage(error.message)
		}
	}
	
	return (
		<div id="unlock-section">
			<Helmet>
				<meta name="description" content={`${deck?.name ?? ''} - Unlock ${section?.name ?? ''} on memorize.ai. Download on the App Store`} />
				<title>{section?.name ? `Unlock ${section.name}` : 'memorize.ai'}</title>
			</Helmet>
			<Heading textColor="white">{deck?.name}</Heading>
			<Columns>
				<Columns.Column size="half" offset="one-quarter">
					{currentUserLoadingState !== LoadingState.None && (
						<Box id="content-box">
							<Heading>Unlock {section?.name}</Heading>
							<hr />
							{currentUser
								? null
								: (
									<>
										<div className="field">
											<p className="control has-icons-left">
												<input
													className="input"
													type="email"
													placeholder="Email"
													value={email}
													onChange={({ target: { value } }) => setEmail(value)}
												/>
												<span className="icon is-small is-left">
													<FontAwesomeIcon icon={faEnvelope} />
												</span>
											</p>
										</div>
										<div className="field">
											<p className="control has-icons-left">
												<input
													className="input"
													type="password"
													placeholder="Password"
													value={password}
													onChange={({ target: { value } }) => setPassword(value)}
												/>
												<span className="icon is-small is-left">
													<FontAwesomeIcon icon={faLock} />
												</span>
											</p>
										</div>
									</>
								)
							}
							<div id="buttons">
								{errorMessage
									? (
										<div id="error-message">
											{errorMessage === __DECK_NOT_OWNED__ && deckId
												? (
													<Link to={`/d/${deckId}/g`}>
														Click here to get {deck?.name}
													</Link>
												)
												: errorMessage
											}
										</div>
									)
									: (
										<Button
											id="unlock-button"
											className="is-info"
											outlined
											loading={unlockLoadingState === LoadingState.Loading}
											disabled={!(email && password) || unlockLoadingState === LoadingState.Success}
											onClick={() => {
												setUnlockLoadingState(LoadingState.Loading)
												
												auth.signInWithEmailAndPassword(email, password)
													.catch(error => {
														setUnlockLoadingState(LoadingState.Fail)
														setErrorMessage(error.message)
													})
											}}
										>
											<FontAwesomeIcon
												icon={unlockLoadingState === LoadingState.Success ? faCheck : faUnlock}
											/>
										</Button>
									)
								}
								{currentUser && (
									<Button
										id="sign-out-button"
										className="is-info"
										outlined
										loading={signOutLoadingState === LoadingState.Loading}
										onClick={signOut}
									>
										<FontAwesomeIcon icon={faSignOutAlt} />
									</Button>
								)}
							</div>
						</Box>
					)}
				</Columns.Column>
			</Columns>
		</div>
	)
}
