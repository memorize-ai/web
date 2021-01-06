import { useState, useCallback } from 'react'
import { Svg } from 'react-optimized-image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKey } from '@fortawesome/free-solid-svg-icons'
import { faApple } from '@fortawesome/free-brands-svg-icons'

import firebase from 'lib/firebase'
import { DashboardNavbarSelection as Selection } from '.'
import useLayoutAuthState from 'hooks/useLayoutAuthState'
import useCurrentUser from 'hooks/useCurrentUser'
import useDecks from 'hooks/useDecks'
import useUrlForMarket from 'hooks/useUrlForMarket'
import Tab from './NavbarTab'
import Dropdown, { DropdownShadow } from 'components/Dropdown'
import AuthButton from 'components/AuthButton'
import ApiKeyModal from 'components/Modal/ApiKey'
import { isNullish, showSuccess, handleError } from 'lib/utils'
import { APP_STORE_URL, SLACK_INVITE_URL, API_URL } from 'lib/constants'

import homeIcon from 'images/icons/home.svg'
import cartIcon from 'images/icons/cart.svg'
import decksIcon from 'images/icons/decks.svg'
import topicsIcon from 'images/icons/topics.svg'
import userIcon from 'images/icons/purple-user.svg'

import 'firebase/auth'

const auth = firebase.auth()

const DashboardNavbar = ({ selection }: { selection: Selection }) => {
	const isSignedIn = useLayoutAuthState()
	const [currentUser] = useCurrentUser()
	const [decks] = useDecks()
	
	const [isProfileDropdownShowing, setIsProfileDropdownShowing] = useState(false)
	const [isApiKeyModalShowing, setIsApiKeyModalShowing] = useState(false)
	
	const sendForgotPasswordEmail = useCallback(async () => {
		const email = currentUser?.email
		
		if (!email)
			return
		
		try {
			await auth.sendPasswordResetEmail(email)
			showSuccess('Sent password reset email.')
		} catch (error) {
			handleError(error)
		}
	}, [currentUser])
	
	const signOut = useCallback(async () => {
		try {
			await auth.signOut()
			window.location.href = '/'
		} catch (error) {
			handleError(error)
		}
	}, [])
	
	return (
		<div className="dashboard-navbar">
			<div className="tabs">
				<Tab
					href="/"
					title="Home"
					isSelected={selection === Selection.Home}
					isDisabled={!isSignedIn}
				>
					<Svg src={homeIcon} />
				</Tab>
				<Tab
					href={useUrlForMarket()}
					title="Market"
					isSelected={selection === Selection.Market}
					isDisabled={false}
				>
					<Svg src={cartIcon} />
				</Tab>
				<Tab
					href="/decks"
					title="Decks"
					isSelected={selection === Selection.Decks}
					isDisabled={!decks.length}
					message={
						decks.length
							? undefined
							: 'First, get a deck from the Market'
					}
				>
					<Svg src={decksIcon} />
				</Tab>
				<Tab
					href="/interests"
					title="Interests"
					isSelected={selection === Selection.Interests}
					isDisabled={!isSignedIn}
				>
					<Svg src={topicsIcon} />
				</Tab>
			</div>
			<div className="right">
				<a
					className="download-app"
					href={APP_STORE_URL}
					target="_blank"
					rel="nofollow noreferrer noopener"
				>
					<FontAwesomeIcon icon={faApple} />
				</a>
				{isSignedIn
					? (
						<Dropdown
							className="profile-dropdown"
							shadow={DropdownShadow.Screen}
							trigger={<Svg src={userIcon} />}
							isShowing={isProfileDropdownShowing}
							setIsShowing={setIsProfileDropdownShowing}
						>
							<div className="settings">
								<label>Name{isNullish(currentUser?.name) ? ' (LOADING)' : ''}</label>
								<input
									className="name-input"
									type="name"
									value={currentUser?.name ?? ''}
									onChange={({ target: { value } }) =>
										currentUser?.updateName(value)
									}
								/>
								<label>Email{isNullish(currentUser?.email) ? ' (LOADING)' : ''}</label>
								<p className="email">{currentUser?.email ?? ''}</p>
							</div>
							<button className="forgot-password" onClick={sendForgotPasswordEmail}>
								Forgot password
							</button>
							<button className="sign-out" onClick={signOut}>
								Sign out
							</button>
							<label className="footer-label">
								Contact
							</label>
							<p className="footer-info">
								<a
									href={SLACK_INVITE_URL}
									target="_blank"
									rel="nofollow noreferrer noopener"
								>
									Join Slack
								</a> or email <a
									href="mailto:support@memorize.ai"
									target="_blank"
									rel="nofollow noreferrer noopener"
								>
									support@memorize.ai
								</a>
							</p>
							<label className="footer-label">
								Develop
							</label>
							<p className="footer-info">
								<a
									href="https://github.com/memorize-ai"
									target="_blank"
									rel="noopener noreferrer nofollow"
								>
									GitHub
								</a> • <a
									href={API_URL}
									target="_blank"
									rel="nofollow noreferrer noopener"
								>
									API docs
								</a> • <button onClick={() => setIsApiKeyModalShowing(true)}>
									My API key
								</button>
							</p>
						</Dropdown>
					)
					: (
						<AuthButton className="auth-button">
							<p>Log in <span>/</span> Sign up</p>
							<FontAwesomeIcon icon={faKey} />
						</AuthButton>
					)
				}
			</div>
			{currentUser?.apiKey && (
				<ApiKeyModal
					value={currentUser.apiKey}
					isShowing={isApiKeyModalShowing}
					setIsShowing={setIsApiKeyModalShowing}
				/>
			)}
		</div>
	)
}

export default DashboardNavbar
