import { useCallback } from 'react'
import Link from 'next/link'
import { Svg } from 'react-optimized-image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faBell,
	faChevronRight,
	faCog
} from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import useCurrentUser from 'hooks/useCurrentUser'
import useUserImageUrl from 'hooks/useUserImageUrl'
import Dropdown, { DropdownShadow } from 'components/Dropdown'

import defaultUserImage from 'images/defaults/user.svg'
import styles from './index.module.scss'

export interface DashboardNavbarProfileDropdownProps {
	isShowing: boolean
	setIsShowing(isShowing: boolean): void
}

const DashboardNavbarProfileDropdown = ({
	isShowing,
	setIsShowing
}: DashboardNavbarProfileDropdownProps) => {
	const [currentUser] = useCurrentUser()
	const imageUrl = useUserImageUrl()

	const name = currentUser?.name
	const email = currentUser?.email

	const hide = useCallback(() => {
		setIsShowing(false)
	}, [setIsShowing])

	return (
		<Dropdown
			className={styles.root}
			triggerClassName={cx({
				[styles.customTrigger]: imageUrl,
				[styles.resetTrigger]: !imageUrl
			})}
			contentClassName={styles.content}
			shadow={DropdownShadow.Screen}
			trigger={
				imageUrl ? (
					<img
						className={styles.triggerImage}
						src={imageUrl}
						alt={currentUser?.name ?? 'Profile picture'}
					/>
				) : (
					<Svg
						className={styles.triggerIcon}
						src={defaultUserImage}
						viewBox={`0 0 ${defaultUserImage.width} ${defaultUserImage.height}`}
					/>
				)
			}
			isShowing={isShowing}
			setIsShowing={setIsShowing}
		>
			<div className={styles.header}>
				{currentUser && currentUser.slugId && currentUser.slug && (
					<Link href={`/u/${currentUser.slugId}/${currentUser.slug}`}>
						<a className={styles.profile} onClick={hide}>
							{imageUrl ? (
								<img
									className={styles.profileImage}
									src={imageUrl}
									alt={currentUser.name ?? 'Profile picture'}
								/>
							) : (
								<Svg
									className={styles.profileDefaultImage}
									src={defaultUserImage}
									viewBox={`0 0 ${defaultUserImage.width} ${defaultUserImage.height}`}
								/>
							)}
							My profile
							<FontAwesomeIcon
								className={styles.profileIcon}
								icon={faChevronRight}
							/>
						</a>
					</Link>
				)}
				<Link href="/settings">
					<a className={styles.settings} onClick={hide}>
						<FontAwesomeIcon icon={faCog} />
					</a>
				</Link>
			</div>
			<label className={styles.label}>Name{name ? '' : ' (loading...)'}</label>
			<p className={styles.value}>{name ?? ''}</p>
			<label className={styles.label}>
				Email{email ? '' : ' (loading...)'}
			</label>
			<p className={styles.value}>{email ?? ''}</p>
			<hr className={styles.divider} />
			<Link href="/settings/notifications">
				<a className={styles.notifications} onClick={hide}>
					<FontAwesomeIcon className={styles.notificationsIcon} icon={faBell} />
					Notifications
				</a>
			</Link>
		</Dropdown>
	)
}

export default DashboardNavbarProfileDropdown
