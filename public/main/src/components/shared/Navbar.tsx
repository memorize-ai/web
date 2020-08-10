import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faKey } from '@fortawesome/free-solid-svg-icons'

import useAuthState from '../../hooks/useAuthState'
import AuthButton from '../shared/AuthButton'
import Logo, { LogoType } from './Logo'
import MarketSearchLink from './MarketSearchLink'
import { urlForMarket } from '../Dashboard/Market'

import '../../scss/components/Navbar.scss'

const Navbar = () => {
	const isSignedIn = useAuthState()
	const marketUrl = urlForMarket()
	
	return (
		<div className="navbar">
			<Link to="/" className="logo">
				<Logo type={LogoType.Capital} />
			</Link>
			<div className="items">
				<MarketSearchLink />
				<Link to={marketUrl} className="market-link">
					<FontAwesomeIcon icon={faSearch} />
				</Link>
				{isSignedIn
					? (
						<Link to="/" className="dashboard-button">
							Dashboard
						</Link>
					)
					: (
						<AuthButton className="auth-button">
							<p>Log in <span>/</span> Sign up</p>
							<FontAwesomeIcon icon={faKey} />
						</AuthButton>
					)
				}
			</div>
		</div>
	)
}

export default Navbar
