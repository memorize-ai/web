import { useState, useCallback } from 'react'
import { Svg } from 'react-optimized-image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKey } from '@fortawesome/free-solid-svg-icons'
import { faApple } from '@fortawesome/free-brands-svg-icons'
import cx from 'classnames'

import firebase from 'lib/firebase'
import { DashboardNavbarSelection as Selection } from '..'
import useLayoutAuthState from 'hooks/useLayoutAuthState'
import useCurrentUser from 'hooks/useCurrentUser'
import useDecks from 'hooks/useDecks'
import useUrlForMarket from 'hooks/useUrlForMarket'
import Tab from './Tab'
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

import styles from './index.module.scss'

import 'firebase/auth'

const auth = firebase.auth()

export interface DashboardNavbarProps {
	className?: string
	selection: Selection
	expectsSignIn?: boolean | null
}

const DashboardNavbar = ({
	className,
	selection,
	expectsSignIn = null
}: DashboardNavbarProps) => {
	const isSignedIn = useLayoutAuthState() ?? expectsSignIn
	const [currentUser] = useCurrentUser()
	const [decks] = useDecks()

	const [isProfileDropdownShowing, setIsProfileDropdownShowing] = useState(
		false
	)
	const [isApiKeyModalShowing, setIsApiKeyModalShowing] = useState(false)

	const sendForgotPasswordEmail = useCallback(async () => {
		const email = currentUser?.email

		if (!email) return

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
		<div className={cx(styles.root, className)}>
			<div className={styles.tabs}>
				<Tab
					href="/"
					title="Home"
					isSelected={selection === Selection.Home}
					isDisabled={false}
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
						decks.length ? undefined : 'First, get a deck from the Market'
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
			<div className={styles.right}>
				<a
					className={styles.download}
					href={APP_STORE_URL}
					target="_blank"
					rel="nofollow noreferrer noopener"
				>
					<FontAwesomeIcon className={styles.downloadIcon} icon={faApple} />
				</a>
				{isSignedIn === null ? null : isSignedIn ? (
					<Dropdown
						className={styles.profile}
						triggerClassName={styles.profileTrigger}
						contentClassName={styles.profileContent}
						shadow={DropdownShadow.Screen}
						trigger={
							<Svg className={styles.profileTriggerIcon} src={userIcon} />
						}
						isShowing={isProfileDropdownShowing}
						setIsShowing={setIsProfileDropdownShowing}
					>
						<div className={styles.settings}>
							<label className={styles.label}>
								Name
								{isNullish(currentUser?.name) ? ' (LOADING)' : ''}
							</label>
							<input
								className={styles.name}
								type="name"
								value={currentUser?.name ?? ''}
								onChange={({ target: { value } }) =>
									currentUser?.updateName(value)
								}
							/>
							<label className={styles.label}>
								Email
								{isNullish(currentUser?.email) ? ' (LOADING)' : ''}
							</label>
							<p className={styles.email}>{currentUser?.email ?? ''}</p>
						</div>
						<button
							className={styles.forgotPassword}
							onClick={sendForgotPasswordEmail}
						>
							Forgot password
						</button>
						<button className={styles.signOut} onClick={signOut}>
							Sign out
						</button>
						<label className={styles.footerLabel}>Contact</label>
						<p className={styles.footerInfo}>
							<a
								className={styles.footerAction}
								href={SLACK_INVITE_URL}
								target="_blank"
								rel="nofollow noreferrer noopener"
							>
								Join Slack
							</a>{' '}
							or email{' '}
							<a
								className={styles.footerAction}
								href="mailto:support@memorize.ai"
								target="_blank"
								rel="nofollow noreferrer noopener"
							>
								support@memorize.ai
							</a>
						</p>
						<label className={styles.footerLabel}>Develop</label>
						<p className={styles.footerInfo}>
							<a
								className={styles.footerAction}
								href="https://github.com/memorize-ai"
								target="_blank"
								rel="noopener noreferrer nofollow"
							>
								GitHub
							</a>{' '}
							•{' '}
							<a
								className={styles.footerAction}
								href={API_URL}
								target="_blank"
								rel="nofollow noreferrer noopener"
							>
								API docs
							</a>{' '}
							•{' '}
							<button
								className={styles.footerAction}
								onClick={() => setIsApiKeyModalShowing(true)}
							>
								My API key
							</button>
						</p>
					</Dropdown>
				) : (
					<AuthButton className={styles.auth}>
						<span className={styles.authText}>
							Log in <span className={styles.authSlash}>/</span> Sign up
						</span>
						<FontAwesomeIcon className={styles.authIcon} icon={faKey} />
					</AuthButton>
				)}
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