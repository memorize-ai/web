import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
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

const auth = firebase.auth()
const firestore = firebase.firestore()

export default () => {
	const { deckId, sectionId } = useParams()
	
	const deck = useDeck(deckId ?? '')
	const section = useSection(deckId ?? '', sectionId ?? '')
	const [currentUser, didFinishLoadingCurrentUser] = useCurrentUser()
	
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [unlockLoadingState, setUnlockLoadingState] = useState(LoadingState.None)
	
	useEffect(() => {
		if (!currentUser)
			return
		
		setUnlockLoadingState(LoadingState.Loading)
		
		firestore.doc(`users/${currentUser.uid}/decks/${deckId}`)
			.update({
				unlockedSections: firebase.firestore.FieldValue.arrayUnion(sectionId)
			})
			.then(() =>
				setUnlockLoadingState(LoadingState.Success)
			)
			.catch(error => {
				alert('Oh no! An error occurred. Please reload the page to try again')
				console.error(error)
				setUnlockLoadingState(LoadingState.Fail)
			})
	}, [currentUser])
	
	const signIn = () =>
		auth.signInWithEmailAndPassword(email, password)
	
	return (
		<div id="unlock-section">
			<Heading textColor="white">{deck?.name}</Heading>
			<Columns>
				<Columns.Column size="half" offset="one-quarter">
					{didFinishLoadingCurrentUser && (
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
								<Button
									id="unlock-button"
									className="is-info"
									outlined
									loading={unlockLoadingState === LoadingState.Loading}
									disabled={!(email && password)}
									onClick={() => {
										setUnlockLoadingState(LoadingState.Loading)
										signIn()
									}}
								>
									<FontAwesomeIcon
										icon={unlockLoadingState === LoadingState.Success ? faCheck : faUnlock}
									/>
								</Button>
								{currentUser && (
									<Button id="sign-out-button" className="is-info" outlined>
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
