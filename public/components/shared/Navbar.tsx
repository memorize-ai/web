import React from 'react'
import Router from 'next/router'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faKey } from '@fortawesome/free-solid-svg-icons'

import useAuthState from 'hooks/useAuthState'
import useSearchState from 'hooks/useSearchState'
import AuthButton from './AuthButton'
import Logo, { LogoType } from './Logo'
import { urlForMarket } from 'lib/utils'

import '../../scss/components/Navbar.scss'

export default () => {
	const isSignedIn = useAuthState()
	const [{ query }] = useSearchState()
	
	return (
		<div className="navbar">
			<Link href="/">
				<a className="logo">
					<Logo type={LogoType.Capital} />
				</a>
			</Link>
			<div className="items">
				<div className="search">
					<input
						placeholder="Access unlimited decks"
						value={query}
						onChange={({ target: { value } }) =>
							Router.push({
								pathname: '/market',
								query: { q: value, s: 'top' }
							})
						}
					/>
					<FontAwesomeIcon icon={faSearch} />
				</div>
				<Link href={urlForMarket()}>
					<a className="market-link">
						<FontAwesomeIcon icon={faSearch} />
					</a>
				</Link>
				{isSignedIn
					? (
						<Link href="/">
							<a className="dashboard-button">
								Dashboard
							</a>
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
