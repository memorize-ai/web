import { Svg } from 'react-optimized-image'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'

import useCurrentUser from 'hooks/useCurrentUser'
import useUserImageUrl from 'hooks/useUserImageUrl'
import Loader from 'components/Loader'

import defaultImage from 'images/defaults/user.svg'
import styles from './index.module.scss'

const AccountSettingsProfileDefaultImage = () => (
	<Svg
		className={styles.defaultImage}
		src={defaultImage}
		viewBox={`0 0 ${defaultImage.width} ${defaultImage.height}`}
	/>
)

const AccountSettingsProfile = () => {
	const [currentUser] = useCurrentUser()
	const imageUrl = useUserImageUrl()

	const slugId = currentUser?.slugId
	const slug = currentUser?.slug

	return currentUser && slugId && slug ? (
		<Link href={`/u/${slugId}/${slug}`}>
			<a className={styles.root}>
				{imageUrl ? (
					<img
						className={styles.image}
						src={imageUrl}
						alt={currentUser.name ?? 'Profile picture'}
					/>
				) : (
					<AccountSettingsProfileDefaultImage />
				)}
				My profile
				<FontAwesomeIcon className={styles.icon} icon={faChevronRight} />
			</a>
		</Link>
	) : (
		<span className={styles.root}>
			<AccountSettingsProfileDefaultImage />
			My profile
			<Loader
				className={styles.loader}
				size="14px"
				thickness="3px"
				color="#007aff"
			/>
		</span>
	)
}

export default AccountSettingsProfile
