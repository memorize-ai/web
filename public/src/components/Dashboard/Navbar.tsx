import React, { ReactNode, useState } from 'react'
import { Link } from 'react-router-dom'

import firebase from '../../firebase'
import { DashboardNavbarSelection as Selection } from '.'
import useAuthState from '../../hooks/useAuthState'
import useCurrentUser from '../../hooks/useCurrentUser'
import Tab from './NavbarTab'
import Dropdown from '../shared/Dropdown'
import { urlWithQuery, isNullish } from '../../utils'

import { ReactComponent as Home } from '../../images/icons/home.svg'
import { ReactComponent as Cart } from '../../images/icons/cart.svg'
import { ReactComponent as Decks } from '../../images/icons/decks.svg'
import { ReactComponent as Topics } from '../../images/icons/topics.svg'
import { ReactComponent as User } from '../../images/icons/purple-user.svg'

import 'firebase/auth'

import '../../scss/components/Dashboard/Navbar.scss'

const auth = firebase.auth()

export default ({ selection, overlay, ...props }: { selection: Selection, overlay?: ReactNode }) => {
	const isSignedIn = useAuthState()
	const [currentUser] = useCurrentUser()
	
	const [isProfileDropdownShowing, setIsProfileDropdownShowing] = useState(false)
	
	const sendForgotPasswordEmail = async () => {
		if (isNullish(currentUser?.email))
			return
		
		try {
			await auth.sendPasswordResetEmail(currentUser!.email)
			
			alert(`Sent. Check your email (${currentUser!.email})`)
		} catch (error) {
			alert(error.message)
			console.error(error)
		}
	}
	
	const signOut = async () => {
		try {
			await auth.signOut()
			
			window.location.href = '/'
		} catch (error) {
			alert(error.message)
			console.error(error)
		}
	}
	
	return (
		<div {...props} className="dashboard-navbar">
			{}
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
					href="/market"
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
					isDisabled={!isSignedIn}
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
			{isSignedIn
				? (
					<Dropdown
						className="profile-dropdown"
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
						</div>
						<button className="forgot-password" onClick={sendForgotPasswordEmail}>
							Forgot password
						</button>
						<button className="sign-out" onClick={signOut}>
							Sign out
						</button>
					</Dropdown>
				)
				: (
					<Link
						to={urlWithQuery('/auth', {
							title: 'Come and join us!',
							next: '/market'
						})}
						className="auth-button"
					>
						Log in <span>/</span> Sign up
					</Link>
				)
			}
		</div>
	)
}
