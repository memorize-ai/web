import Link from 'next/link'
import Img from 'react-optimized-image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faKey } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import useLayoutAuthState from 'hooks/useLayoutAuthState'
import useUrlForMarket from 'hooks/useUrlForMarket'
import AuthButton from './AuthButton'
import MarketSearchLink from './MarketSearchLink'

import logo from 'images/logos/capital.jpg'

export interface NavbarProps {
	padding?: boolean
}

const Navbar = ({ padding = true }: NavbarProps) => {
	const isSignedIn = useLayoutAuthState()
	const marketUrl = useUrlForMarket()

	return (
		<div className={cx('navbar', { 'no-padding': !padding })}>
			<Link href="/">
				<a className="logo">
					<Img className="logoImage" src={logo} alt="Logo" webp />
				</a>
			</Link>
			<div className="items">
				<MarketSearchLink />
				<Link href={marketUrl}>
					<a className="market-link">
						<FontAwesomeIcon icon={faSearch} />
					</a>
				</Link>
				{isSignedIn ? (
					<Link href="/">
						<a className="dashboard-button">Dashboard</a>
					</Link>
				) : (
					<AuthButton className="auth-button">
						<p>
							Log in <span>/</span> Sign up
						</p>
						<FontAwesomeIcon icon={faKey} />
					</AuthButton>
				)}
			</div>
		</div>
	)
}

export default Navbar
