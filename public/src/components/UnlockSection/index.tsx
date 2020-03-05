import React, { useState, useEffect } from 'react'
import Helmet from 'react-helmet'
import { Link, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faCheck, faUnlock, faSignOutAlt, faKey } from '@fortawesome/free-solid-svg-icons'

import firebase from '../../firebase'
import LoadingState from '../../models/LoadingState'
import useDeck from '../../hooks/useDeck'
import useSection from '../../hooks/useSection'
import useCurrentUser from '../../hooks/useCurrentUser'
import Input from '../shared/Input'
import Button from '../shared/Button'

import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const __DECK_NOT_OWNED__ = '__DECK_NOT_OWNED__'

const auth = firebase.auth()
const firestore = firebase.firestore()
const storage = firebase.storage().ref()

export default () => {
	const { deckId, sectionId } = useParams()
	
	const deck = useDeck(deckId ?? '')
	const section = useSection(deckId ?? '', sectionId ?? '')
	const [currentUser, currentUserLoadingState] = useCurrentUser()
	
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	
	const [imageUrl, setImageUrl] = useState(null as string | null)
	
	const [unlockLoadingState, setUnlockLoadingState] = useState(LoadingState.None)
	const [signOutLoadingState, setSignOutLoadingState] = useState(LoadingState.None)
	const [errorMessage, setErrorMessage] = useState(null as string | null)
	
	const isUnlockButtonDisabled = !(email && password) || unlockLoadingState === LoadingState.Success
	const isUnlockButtonLoading = unlockLoadingState === LoadingState.Loading
	
	const isSignOutButtonLoading = signOutLoadingState === LoadingState.Loading
	
	useEffect(() => void (async () => {
		if (!(deckId && deck))
			return
		
		if (deck.hasImage)
			storage.child(`decks/${deckId}`).getDownloadURL().then(setImageUrl)
		
		if (!(currentUser && sectionId && section))
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
	})(), [currentUser, deckId, deck, sectionId, section])
	
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
		<div className="h-screen px-4 py-4 gradient-background">
			<Helmet>
				<meta name="description" content={`${deck?.name ?? ''} - Unlock ${section?.name ?? ''} on memorize.ai. Download on the App Store`} />
				<title>{section?.name ? `Unlock ${section.name}` : 'memorize.ai'}</title>
			</Helmet>
			<div className={`flex items-center ${imageUrl ? 'mb-6' : 'ml-2'}`}>
				{imageUrl && (
					<img
						className="w-20 h-20 mr-4 object-cover rounded-lg"
						src={imageUrl}
						alt={deck?.name ?? 'Deck image'}
					/>
				)}
				<h1 className="text-2xl sm:text-4xl text-white font-bold">{deck?.name}</h1>
			</div>
			<div className="md:w-1/2 mx-auto px-6 pt-4 pb-4 bg-white rounded-lg shadow-lg">
				<h1 className="text-2xl sm:text-4xl text-dark-gray font-bold">Unlock {section?.name}</h1>
				<hr className="mt-4 mb-4" />
				<div hidden={currentUser !== null || currentUserLoadingState === LoadingState.Loading}>
					<Input
						icon={faEnvelope}
						type="email"
						placeholder="Email"
						value={email}
						setValue={setEmail}
					/>
					<Input
						className="mt-2"
						icon={faKey}
						type="password"
						placeholder="Password"
						value={password}
						setValue={setPassword}
					/>
				</div>
				<div className="flex mt-4">
					{errorMessage
						? (
							<p className="text-red-600">
								{errorMessage === __DECK_NOT_OWNED__ && deckId
									? (
										<Link to={`/d/${deckId}/g`}>
											Click here to get {deck?.name}
										</Link>
									)
									: errorMessage
								}
							</p>
						)
						: (
							<Button
								className={`
									h-8
									px-8
									text-blue-${isUnlockButtonDisabled ? 200 : 400}
									${isUnlockButtonDisabled || isUnlockButtonLoading ? '' : 'hover:text-white'}
									border-2
									border-blue-${isUnlockButtonDisabled ? 200 : 400}
									${isUnlockButtonDisabled || isUnlockButtonLoading ? '' : 'hover:bg-blue-400'}
									rounded
								`}
								loaderSize="16px"
								loaderThickness="3px"
								loaderColor="#63b3ed"
								loading={isUnlockButtonLoading}
								disabled={isUnlockButtonDisabled}
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
							className={`
								h-8
								ml-auto
								px-8
								text-blue-400
								${isSignOutButtonLoading ? '' : 'hover:text-white'}
								border-2
								border-blue-400
								${isSignOutButtonLoading ? '' : 'hover:bg-blue-400'}
								rounded
							`}
							loaderSize="16px"
							loaderThickness="3px"
							loaderColor="#63b3ed"
							loading={isSignOutButtonLoading}
							onClick={signOut}
						>
							<FontAwesomeIcon icon={faSignOutAlt} />
						</Button>
					)}
				</div>
			</div>
		</div>
	)
}
