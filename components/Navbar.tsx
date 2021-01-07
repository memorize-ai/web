import Link from 'next/link'
import Image from 'react-optimized-image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faKey } from '@fortawesome/free-solid-svg-icons'

import useLayoutAuthState from 'hooks/useLayoutAuthState'
import useUrlForMarket from 'hooks/useUrlForMarket'
import AuthButton from './AuthButton'
import MarketSearchLink from './MarketSearchLink'

import logo from 'images/logos/capital.jpg'

const Navbar = () => {
	const isSignedIn = useLayoutAuthState()
	const marketUrl = useUrlForMarket()

	return (
		<div className="navbar">
			<Link href="/">
				<a className="logo">
					<Image className="logoImage" src={logo} alt="Logo" webp />
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
