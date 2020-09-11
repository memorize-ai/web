import React, { useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShareSquare } from '@fortawesome/free-solid-svg-icons'

import Deck from '../../models/Deck'
import logo from '../../images/logos/transparent.webp'
import logoFallback from '../../images/fallbacks/logos/transparent.jpg'

import styles from '../../scss/components/Inline/Navbar.module.scss'

const InlineNavbar = ({ deck }: { deck: Deck | null }) => {
	const openDeck = useCallback(() => {
		if (deck)
			window.open(`https://memorize.ai/d/${deck.slugId}/${deck.slug}`)
	}, [deck])
	
	const openHome = useCallback(() => {
		window.open('https://memorize.ai')
	}, [])
	
	const action = useCallback(() => {
		
	}, [])
	
	return (
		<nav className={styles.root}>
			<button className={styles.action} onClick={openDeck}>
				<FontAwesomeIcon icon={faShareSquare} />
			</button>
			<button className={styles.logoContainer} onClick={openHome}>
				<picture>
					<source srcSet={logo} type="image/webp" />
					<img className={styles.logo} src={logoFallback} alt="Logo" />
				</picture>
			</button>
			<button className={styles.action} onClick={action}>
				Log in
			</button>
		</nav>
	)
}

export default InlineNavbar
