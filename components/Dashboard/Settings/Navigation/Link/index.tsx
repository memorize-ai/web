import { ReactNode } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'

import styles from './index.module.scss'

export interface SettingsNavigationLinkProps {
	current: string
	href: string
	icon: IconDefinition
	children: ReactNode
}

const SettingsNavigationLink = ({
	current,
	href,
	icon,
	children
}: SettingsNavigationLinkProps) => (
	<Link href={href}>
		<a
			className={styles.root}
			aria-current={current === href ? 'page' : undefined}
		>
			<FontAwesomeIcon className={styles.icon} icon={icon} />
			{children}
			<FontAwesomeIcon className={styles.arrow} icon={faChevronRight} />
		</a>
	</Link>
)

export default SettingsNavigationLink
