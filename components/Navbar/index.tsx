import Link from 'next/link'
import Img from 'react-optimized-image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faKey } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import useLayoutAuthState from 'hooks/useLayoutAuthState'
import useUrlForMarket from 'hooks/useUrlForMarket'
import AuthButton from '../AuthButton'
import MarketSearchLink from '../MarketSearchLink'

import logo from 'images/logos/capital.jpg'
import styles from './index.module.scss'

export interface NavbarProps {
	padding?: boolean
}

const Navbar = ({ padding = true }: NavbarProps) => {
	const isSignedIn = useLayoutAuthState()
	const marketUrl = useUrlForMarket()

	return (
		<div className={cx(styles.root, { [styles.noPadding]: !padding })}>
			<Link href="/">
				<a className={styles.logoLink}>
					<Img className={styles.logo} src={logo} alt="Logo" webp />
				</a>
			</Link>
			<div className={styles.items}>
				<MarketSearchLink
					className={cx(styles.item, styles.marketSearchLink)}
				/>
				<Link href={marketUrl}>
					<a className={cx(styles.item, styles.marketLink)}>
						<FontAwesomeIcon
							className={styles.marketLinkIcon}
							icon={faSearch}
						/>
					</a>
				</Link>
				{isSignedIn ? (
					<Link href="/">
						<a className={cx(styles.item, styles.dashboard)}>Dashboard</a>
					</Link>
				) : (
					<AuthButton className={cx(styles.item, styles.auth)}>
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

export default Navbar
