import { MouseEvent, useState, useCallback } from 'react'
import Head from 'next/head'
import { useDropzone } from 'react-dropzone'
import { Svg } from 'react-optimized-image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import User from 'models/User'
import uploadUserImage from 'lib/uploadUserImage'
import resetUserImage from 'lib/resetUserImage'
import handleError from 'lib/handleError'
import useCurrentUser from 'hooks/useCurrentUser'
import ConfirmationModal from 'components/Modal/Confirmation'

import defaultImage from 'images/icons/purple-user.svg'
import styles from './index.module.scss'

export interface UserPageImageProps {
	user: User
}

const UserPageImage = ({ user }: UserPageImageProps) => {
	const [newImageUrl, setNewImageUrl] = useState<string | null | undefined>()

	const onDrop = useCallback(
		async (files: File[]) => {
			const file = files[0]
			if (!file) return

			try {
				setNewImageUrl(URL.createObjectURL(file))
				await uploadUserImage(user.id, file)
			} catch (error) {
				setNewImageUrl(null)
				handleError(error)
			}
		},
		[user.id, setNewImageUrl]
	)

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		multiple: false,
		onDrop
	})

	const imageUrl = newImageUrl === undefined ? user.imageUrl : newImageUrl

	const [currentUser] = useCurrentUser()
	const [isConfirmResetShowing, setIsConfirmResetShowing] = useState(false)

	const isSelf = currentUser?.id === user.id
	const canUpload = isSelf && !isConfirmResetShowing

	const confirmReset = useCallback(
		(event: MouseEvent<HTMLButtonElement>) => {
			event.stopPropagation()
			setIsConfirmResetShowing(true)
		},
		[setIsConfirmResetShowing]
	)

	const reset = useCallback(async () => {
		try {
			setNewImageUrl(null)
			setIsConfirmResetShowing(false)

			await resetUserImage(user.id)
		} catch (error) {
			setNewImageUrl(newImageUrl)
			handleError(error)
		}
	}, [user.id, setNewImageUrl, setIsConfirmResetShowing])

	return (
		<div
			{...(canUpload ? getRootProps() : null)}
			className={cx(styles.root, { [styles.dragging]: isDragActive })}
		>
			<Head>
				{user.imageUrl ? (
					<link
						key={`preload-${user.id}`}
						rel="preload"
						href={user.imageUrl}
						as="image"
					/>
				) : null}
			</Head>
			{canUpload && <input {...getInputProps()} />}
			{imageUrl ? (
				<img
					className={styles.image}
					src={imageUrl}
					alt={user.name ?? 'Profile picture'}
				/>
			) : (
				<Svg
					className={styles.defaultImage}
					src={defaultImage}
					viewBox={`0 0 ${defaultImage.width} ${defaultImage.height}`}
				/>
			)}
			{isSelf && (
				<div className={styles.overlay}>
					<FontAwesomeIcon className={styles.uploadIcon} icon={faImage} />
					<p className={styles.uploadMessage}>Click or drag</p>
					{user.hasImage && (
						<button className={styles.reset} onClick={confirmReset}>
							Reset
						</button>
					)}
					<ConfirmationModal
						title="Reset profile picture"
						message="Are you sure? Your profile picture will be deleted."
						onConfirm={reset}
						buttonText="Reset"
						buttonBackground="#e53e3e"
						isShowing={isConfirmResetShowing}
						setIsShowing={setIsConfirmResetShowing}
					/>
				</div>
			)}
		</div>
	)
}

export default UserPageImage
