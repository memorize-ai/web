import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faCheck, faUnlock, faSignOutAlt, faKey } from '@fortawesome/free-solid-svg-icons'

import firebase from '../firebase'
import LoadingState from '../LoadingState'
import useDeck from '../hooks/useDeck'
import useCurrentUser from '../hooks/useCurrentUser'
import Input from './Input'
import Button from './Button'

import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const auth = firebase.auth()
const firestore = firebase.firestore()
const storage = firebase.storage().ref()

export default () => {
	const { deckId } = useParams()
	
	const deck = useDeck(deckId ?? '')
	const [currentUser, currentUserLoadingState] = useCurrentUser()
	
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	
	const [imageUrl, setImageUrl] = useState(null as string | null)
	
	const [getLoadingState, setGetLoadingState] = useState(LoadingState.None)
	const [signOutLoadingState, setSignOutLoadingState] = useState(LoadingState.None)
	const [errorMessage, setErrorMessage] = useState(null as string | null)
	
	const isGetButtonDisabled = !(email && password) || getLoadingState === LoadingState.Success
	const isGetButtonLoading = getLoadingState === LoadingState.Loading
	
	const isSignOutButtonLoading = signOutLoadingState === LoadingState.Loading
	
	useEffect(() => void (async () => {
		if (!(deckId && deck))
			return
		
		if (deck.hasImage)
			storage.child(`decks/${deckId}`).getDownloadURL().then(setImageUrl)
		
		if (!currentUser)
			return
		
		setGetLoadingState(LoadingState.Loading)
		setErrorMessage(null)
		
		try {
			const ref = firestore.doc(`users/${currentUser.uid}/decks/${deckId}`)
			
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
		<div className="h-screen px-4 py-4 gradient-background">
			<Helmet>
				<meta name="description" content={`Get ${deck?.name ?? ''} on memorize.ai. Download on the App Store`} />
				<title>{deck?.name ? `Get ${deck.name}` : 'memorize.ai'}</title>
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
				<h1 className="text-2xl sm:text-4xl text-dark-gray font-bold">Get {deck?.name}</h1>
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
						? <p className="text-red-600">{errorMessage}</p>
						: (
							<Button
								className={`
									h-8
									px-8
									text-blue-${isGetButtonDisabled ? 200 : 400}
									${isGetButtonDisabled || isGetButtonLoading ? '' : 'hover:text-white'}
									border-2
									border-blue-${isGetButtonDisabled ? 200 : 400}
									${isGetButtonDisabled || isGetButtonLoading ? '' : 'hover:bg-blue-400'}
									rounded
								`}
								loaderSize="16px"
								loaderThickness="3px"
								loaderColor="#63b3ed"
								loading={isGetButtonLoading}
								disabled={isGetButtonDisabled}
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
