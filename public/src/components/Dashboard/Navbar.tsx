import React, { useState, memo, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faApple } from '@fortawesome/free-brands-svg-icons'

import firebase from '../../firebase'
import { DashboardNavbarSelection as Selection } from '.'
import useAuthState from '../../hooks/useAuthState'
import useCurrentUser from '../../hooks/useCurrentUser'
import useDecks from '../../hooks/useDecks'
import Tab from './NavbarTab'
import Dropdown, { DropdownShadow } from '../shared/Dropdown'
import AuthButton from '../shared/AuthButton'
import { urlForMarket } from './Market'
import { isNullish, showSuccess, handleError } from '../../utils'
import { APP_STORE_URL } from '../../constants'

import { ReactComponent as Home } from '../../images/icons/home.svg'
import { ReactComponent as Cart } from '../../images/icons/cart.svg'
import { ReactComponent as Decks } from '../../images/icons/decks.svg'
import { ReactComponent as Topics } from '../../images/icons/topics.svg'
import { ReactComponent as User } from '../../images/icons/purple-user.svg'

import 'firebase/auth'

import '../../scss/components/Dashboard/Navbar.scss'

const auth = firebase.auth()

const DashboardNavbar = ({ selection }: { selection: Selection }) => {
	const isSignedIn = useAuthState()
	const [currentUser] = useCurrentUser()
	const [decks] = useDecks()
	
	const [isProfileDropdownShowing, setIsProfileDropdownShowing] = useState(false)
	
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
					<Home />
				</Tab>
				<Tab
					href={urlForMarket()}
					title="Market"
					isSelected={selection === Selection.Market}
					isDisabled={false}
				>
					<Cart />
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
					<Decks />
				</Tab>
				<Tab
					href="/interests"
					title="Interests"
					isSelected={selection === Selection.Interests}
					isDisabled={!isSignedIn}
				>
					<Topics />
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
							trigger={<User />}
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
								<label>API key{isNullish(currentUser?.apiKey) ? ' (LOADING)' : ''}</label>
								<p className="api-key">{currentUser?.apiKey ?? ''}</p>
							</div>
							<button className="forgot-password" onClick={sendForgotPasswordEmail}>
								Forgot password
							</button>
							<button className="sign-out" onClick={signOut}>
								Sign out
							</button>
							<a
								className="contact-us"
								href="mailto:support@memorize.ai"
								target="_blank"
								rel="nofollow noreferrer noopener"
							>
								Contact us at <span>support@memorize.ai</span>
							</a>
						</Dropdown>
					)
					: (
						<AuthButton className="auth-button">
							Log in <span>/</span> Sign up
						</AuthButton>
					)
				}
			</div>
		</div>
	)
}

export default memo(DashboardNavbar)
