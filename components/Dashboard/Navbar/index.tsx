import { useState } from 'react'
import { Svg } from 'react-optimized-image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKey } from '@fortawesome/free-solid-svg-icons'
import { faApple } from '@fortawesome/free-brands-svg-icons'
import cx from 'classnames'

import { DashboardNavbarSelection as Selection } from '..'
import useLayoutAuthState from 'hooks/useLayoutAuthState'
import useDecks from 'hooks/useDecks'
import useUrlForMarket from 'hooks/useUrlForMarket'
import Tab from './Tab'
import AuthButton from 'components/AuthButton'
import ProfileDropdown from './ProfileDropdown'
import { APP_STORE_URL } from 'lib/constants'

import homeIcon from 'images/icons/home.svg'
import cartIcon from 'images/icons/cart.svg'
import decksIcon from 'images/icons/decks.svg'
import topicsIcon from 'images/icons/topics.svg'

import styles from './index.module.scss'

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
	const [decks] = useDecks()

	const [isProfileDropdownShowing, setIsProfileDropdownShowing] = useState(
		false
	)

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
					<ProfileDropdown
						isShowing={isProfileDropdownShowing}
						setIsShowing={setIsProfileDropdownShowing}
					/>
				) : (
					<AuthButton className={styles.auth}>
						<span className={styles.authText}>
							Log in <span className={styles.authSlash}>/</span> Sign up
						</span>
						<FontAwesomeIcon className={styles.authIcon} icon={faKey} />
					</AuthButton>
				)}
			</div>
		</div>
	)
}

export default DashboardNavbar
