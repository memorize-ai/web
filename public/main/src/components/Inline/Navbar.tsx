import React, { useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShareSquare } from '@fortawesome/free-solid-svg-icons'

import Deck from '../../models/Deck'
import LoadingState from '../../models/LoadingState'
import useCurrentUser from '../../hooks/useCurrentUser'
import Loader from '../shared/Loader'

import logo from '../../images/logos/transparent.webp'
import logoFallback from '../../images/fallbacks/logos/transparent.jpg'

import styles from '../../scss/components/Inline/Navbar.module.scss'

export interface InlineNavbarProps {
	deck: Deck | null
	action: () => void
}

const InlineNavbar = ({ deck, action }: InlineNavbarProps) => {
	const [user, userLoadingState] = useCurrentUser()
	
	const openDeck = useCallback(() => {
		if (deck)
			window.open(`https://memorize.ai/d/${deck.slugId}/${deck.slug}`)
	}, [deck])
	
	const openHome = useCallback(() => {
		window.open('https://memorize.ai')
	}, [])
	
	return (
		<nav className={styles.root}>
			<button className={styles.action} onClick={openDeck}>
				{deck
					? <FontAwesomeIcon icon={faShareSquare} />
					: <Loader size="16px" thickness="3px" color="#4a4a4a" />
				}
			</button>
			<button className={styles.logoContainer} onClick={openHome}>
				<picture>
					<source srcSet={logo} type="image/webp" />
					<img className={styles.logo} src={logoFallback} alt="Logo" />
				</picture>
			</button>
			<button className={styles.action} onClick={action}>
				{userLoadingState === LoadingState.Success
					? user ? 'Done' : 'Log in'
					: <Loader size="16px" thickness="3px" color="#4a4a4a" />
				}
			</button>
		</nav>
	)
}

export default InlineNavbar
