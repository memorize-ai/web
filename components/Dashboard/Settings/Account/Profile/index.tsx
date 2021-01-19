import { forwardRef } from 'react'
import { Svg } from 'react-optimized-image'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'

import User from 'models/User'
import useCurrentUser from 'hooks/useCurrentUser'
import useUserImageUrl from 'hooks/useUserImageUrl'
import Loader from 'components/Loader'

import defaultImage from 'images/defaults/user.svg'
import styles from './index.module.scss'

interface AccountSettingsProfileContentProps {
	href?: string
	currentUser: User | null
}

const AccountSettingsProfileContent = forwardRef<
	HTMLAnchorElement,
	AccountSettingsProfileContentProps
>(({ href, currentUser }, ref) => {
	const imageUrl = useUserImageUrl()

	return (
		<a ref={ref} className={styles.root} href={href}>
			{imageUrl ? (
				<img
					className={styles.image}
					src={imageUrl}
					alt={currentUser?.name ?? 'Profile picture'}
				/>
			) : (
				<Svg
					className={styles.defaultImage}
					src={defaultImage}
					viewBox={`0 0 ${defaultImage.width} ${defaultImage.height}`}
				/>
			)}
			My profile
			{href ? (
				<FontAwesomeIcon className={styles.icon} icon={faChevronRight} />
			) : (
				<Loader
					className={styles.loader}
					size="14px"
					thickness="3px"
					color="#007aff"
				/>
			)}
		</a>
	)
})

const AccountSettingsProfile = () => {
	const [currentUser] = useCurrentUser()

	const slugId = currentUser?.slugId
	const slug = currentUser?.slug

	return slugId && slug ? (
		<Link href={`/u/${slugId}/${slug}`} passHref>
			<AccountSettingsProfileContent currentUser={currentUser} />
		</Link>
	) : (
		<AccountSettingsProfileContent currentUser={null} />
	)
}

export default AccountSettingsProfile
