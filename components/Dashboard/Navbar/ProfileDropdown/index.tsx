import { useState, useCallback, useEffect, ChangeEvent, FormEvent } from 'react'
import Link from 'next/link'
import { Svg } from 'react-optimized-image'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import firebase from 'lib/firebase'
import handleError from 'lib/handleError'
import { SLACK_INVITE_URL, API_URL } from 'lib/constants'
import useCurrentUser from 'hooks/useCurrentUser'
import useUserImageUrl from 'hooks/useUserImageUrl'
import Dropdown, { DropdownShadow } from 'components/Dropdown'
import Loader from 'components/Loader'
import ApiKeyModal from 'components/Modal/ApiKey'

import defaultUserImage from 'images/defaults/user.svg'
import styles from './index.module.scss'

import 'firebase/auth'

const auth = firebase.auth()

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

	const currentUserName = currentUser && currentUser.name

	const [name, setName] = useState(currentUserName)
	const [isNameLoading, setIsNameLoading] = useState(false)

	const [isApiKeyModalShowing, setIsApiKeyModalShowing] = useState(false)

	const hide = useCallback(() => {
		setIsShowing(false)
	}, [setIsShowing])

	const onNameChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setName(event.target.value)
		},
		[setName]
	)

	const saveName = useCallback(
		async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault()

			if (!(currentUser && name) || currentUser.name === name || isNameLoading)
				return

			try {
				setIsNameLoading(true)
				await currentUser.updateName(name)
			} catch (error) {
				handleError(error)
			} finally {
				setIsNameLoading(false)
			}
		},
		[currentUser, name, isNameLoading, setIsNameLoading]
	)

	const sendForgotPasswordEmail = useCallback(async () => {
		const email = currentUser?.email

		if (!email) return

		try {
			await auth.sendPasswordResetEmail(email)
			toast.success('Sent password reset email.')
		} catch (error) {
			handleError(error)
		}
	}, [currentUser])

	const signOut = useCallback(async () => {
		try {
			await auth.signOut()
			window.location.href = '/'
		} catch (error) {
			handleError(error)
		}
	}, [])

	useEffect(() => {
		if (currentUserName) setName(currentUserName)
	}, [currentUserName, setName])

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
			{currentUser && currentUser.slugId && currentUser.slug && (
				<Link href={`/u/${currentUser.slugId}/${currentUser.slug}`}>
					<a className={styles.profileLink} onClick={hide}>
						{imageUrl ? (
							<img
								className={styles.profileLinkImage}
								src={imageUrl}
								alt={currentUser.name ?? 'Profile picture'}
							/>
						) : (
							<Svg
								className={styles.profileLinkDefaultImage}
								src={defaultUserImage}
								viewBox={`0 0 ${defaultUserImage.width} ${defaultUserImage.height}`}
							/>
						)}
						My profile
						<FontAwesomeIcon
							className={styles.profileLinkIcon}
							icon={faChevronRight}
						/>
					</a>
				</Link>
			)}
			<div className={styles.settings}>
				<form className={styles.nameForm} onSubmit={saveName}>
					<div className={styles.nameFormHeader}>
						<label className={styles.nameLabel}>
							Name
							{currentUser?.name ? '' : ' (loading...)'}
						</label>
						{isNameLoading ? (
							<Loader
								className={styles.saveNameLoader}
								size="16px"
								thickness="3px"
								color="#007aff"
							/>
						) : (
							<button
								className={styles.saveName}
								disabled={!name || currentUser?.name === name || isNameLoading}
							>
								Save
							</button>
						)}
					</div>
					<input
						className={styles.name}
						type="name"
						value={name ?? ''}
						onChange={onNameChange}
					/>
				</form>
				<label className={styles.emailLabel}>
					Email
					{currentUser?.email ? '' : ' (loading...)'}
				</label>
				<p className={styles.email}>{currentUser?.email ?? ''}</p>
			</div>
			<button
				className={styles.forgotPassword}
				onClick={sendForgotPasswordEmail}
			>
				Forgot password
			</button>
			<button className={styles.signOut} onClick={signOut}>
				Sign out
			</button>
			<label className={styles.footerLabel}>Contact</label>
			<p className={styles.footerInfo}>
				<a
					className={styles.footerAction}
					href={SLACK_INVITE_URL}
					target="_blank"
					rel="nofollow noreferrer noopener"
				>
					Join Slack
				</a>{' '}
				or email{' '}
				<a
					className={styles.footerAction}
					href="mailto:support@memorize.ai"
					target="_blank"
					rel="nofollow noreferrer noopener"
				>
					support@memorize.ai
				</a>
			</p>
			<label className={styles.footerLabel}>Develop</label>
			<p className={styles.footerInfo}>
				<a
					className={styles.footerAction}
					href="https://github.com/memorize-ai"
					target="_blank"
					rel="noopener noreferrer nofollow"
				>
					GitHub
				</a>{' '}
				•{' '}
				<a
					className={styles.footerAction}
					href={API_URL}
					target="_blank"
					rel="nofollow noreferrer noopener"
				>
					API docs
				</a>{' '}
				•{' '}
				<button
					className={styles.footerAction}
					onClick={() => setIsApiKeyModalShowing(true)}
				>
					My API key
				</button>
			</p>
			{currentUser?.apiKey && (
				<ApiKeyModal
					value={currentUser.apiKey}
					isShowing={isApiKeyModalShowing}
					setIsShowing={setIsApiKeyModalShowing}
				/>
			)}
		</Dropdown>
	)
}

export default DashboardNavbarProfileDropdown
