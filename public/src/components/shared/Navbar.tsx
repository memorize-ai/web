import React from 'react'
import { useHistory, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faKey } from '@fortawesome/free-solid-svg-icons'

import useAuthState from '../../hooks/useAuthState'
import useSearchState from '../../hooks/useSearchState'
import AuthButton from '../shared/AuthButton'
import Logo, { LogoType } from './Logo'
import { urlWithQuery } from '../../utils'
import { urlForMarket } from '../Dashboard/Market'

import '../../styles/components/Navbar.scss'

export default () => {
	const history = useHistory()
	
	const isSignedIn = useAuthState()
	const [{ query }] = useSearchState()
	
	return (
		<div className="navbar">
			<Link to="/" className="logo">
				<Logo type={LogoType.Capital} />
			</Link>
			<div className="items">
				<div className="search">
					<input
						placeholder="Access unlimited decks"
						value={query}
						onChange={({ target: { value } }) =>
							history.push(urlWithQuery('/market', {
								q: value,
								s: 'top'
							}))
						}
					/>
					<FontAwesomeIcon icon={faSearch} />
				</div>
				<Link to={urlForMarket()} className="market-link">
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
