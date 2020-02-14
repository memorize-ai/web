import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { Heading, Box, Columns, Button } from 'react-bulma-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faLock, faCheck, faUnlock, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

import firebase from '../firebase'
import LoadingState from '../LoadingState'
import useDeck from '../hooks/useDeck'
import useCurrentUser from '../hooks/useCurrentUser'

import 'firebase/auth'
import 'firebase/firestore'
import '../scss/GetDeck.scss'

const auth = firebase.auth()
const firestore = firebase.firestore()

export default () => {
	const { deckId } = useParams()
	
	const deck = useDeck(deckId ?? '')
	const [currentUser, currentUserLoadingState] = useCurrentUser()
	
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	
	const [getLoadingState, setGetLoadingState] = useState(LoadingState.None)
	const [signOutLoadingState, setSignOutLoadingState] = useState(LoadingState.None)
	const [errorMessage, setErrorMessage] = useState(null as string | null)
	
	useEffect(() => void (async () => {
		if (!(currentUser && deckId && deck))
			return
		
		setGetLoadingState(LoadingState.Loading)
		setErrorMessage(null)
		
		const ref = firestore.doc(`users/${currentUser.uid}/decks/${deckId}`)
		
		try {
			if ((await ref.get()).exists)
				throw new Error('You already own this deck!')
			
			const { docs: [firstSection] } = await firestore
					.collection(`decks/${deckId}/sections`)
					.where('index', '==', 0)
					.get()
			
			const { unsectionedCardCount } = deck
			
			if (unsectionedCardCount === undefined)
				throw new Error('This deck does not exist!')
			
			const firstSectionCardCount = firstSection?.get('cardCount') ?? 0
			const unlockedCardCount = unsectionedCardCount + firstSectionCardCount
			
			await ref
				.set({
					added: firebase.firestore.FieldValue.serverTimestamp(),
					dueCardCount: unlockedCardCount,
					unsectionedDueCardCount: unsectionedCardCount,
					unlockedCardCount,
					sections: firstSection
						? { [firstSection.id]: firstSectionCardCount }
						: {}
				})
			
			setGetLoadingState(LoadingState.Success)
			setErrorMessage(null)
		} catch (error) {
			setGetLoadingState(LoadingState.Fail)
			setErrorMessage(error.message)
		}
	})(), [currentUser, deckId, deck])
	
	const signOut = async () => {
		setGetLoadingState(LoadingState.None)
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
		<div id="get-deck">
			<Helmet>
				<meta name="description" content={`Get ${deck?.name ?? ''} on memorize.ai. Download on the App Store`} />
				<title>{deck?.name ? `Get ${deck.name}` : 'memorize.ai'}</title>
			</Helmet>
			<Heading textColor="white">{deck?.name}</Heading>
			<Columns>
				<Columns.Column size="half" offset="one-quarter">
					{currentUserLoadingState !== LoadingState.None && (
						<Box id="content-box">
							<Heading>Get {deck?.name}</Heading>
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
									? <div id="error-message">{errorMessage}</div>
									: (
										<Button
											id="get-button"
											className="is-info"
											outlined
											loading={getLoadingState === LoadingState.Loading}
											disabled={!(email && password) || getLoadingState === LoadingState.Success}
											onClick={() => {
												setGetLoadingState(LoadingState.Loading)
												
												auth.signInWithEmailAndPassword(email, password)
													.catch(error => {
														setGetLoadingState(LoadingState.Fail)
														setErrorMessage(error.message)
													})
											}}
										>
											<FontAwesomeIcon
												icon={getLoadingState === LoadingState.Success ? faCheck : faUnlock}
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
