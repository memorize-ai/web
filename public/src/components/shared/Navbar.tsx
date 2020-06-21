import React, { memo, useCallback } from 'react'
import { useHistory, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faKey } from '@fortawesome/free-solid-svg-icons'

import useAuthState from '../../hooks/useAuthState'
import useSearchState from '../../hooks/useSearchState'
import AuthButton from '../shared/AuthButton'
import Logo, { LogoType } from './Logo'
import { urlForMarket } from '../Dashboard/Market'

import '../../scss/components/Navbar.scss'

const Navbar = () => {
	const history = useHistory()
	
	const isSignedIn = useAuthState()
	const [{ query }] = useSearchState()
	
	const marketUrl = urlForMarket()
	
	const goToMarket = useCallback(() => {
		history.push(marketUrl)
	}, [history, marketUrl])
	
	return (
		<div className="navbar">
			<Link to="/" className="logo">
				<Logo type={LogoType.Capital} />
			</Link>
			<div className="items">
				<div className="search">
					<input
						readOnly
						placeholder="Explore unlimited decks"
						value={query}
						onFocus={goToMarket}
					/>
					<FontAwesomeIcon icon={faSearch} />
				</div>
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

export default memo(Navbar)
