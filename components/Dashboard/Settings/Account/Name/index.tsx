import { FormEvent, ChangeEvent, useState, useCallback, useEffect } from 'react'

import handleError from 'lib/handleError'
import useCurrentUser from 'hooks/useCurrentUser'
import Loader from 'components/Loader'

import styles from './index.module.scss'

const INPUT_ID = 'account-settings-name-input'

const AccountSettingsName = () => {
	const [currentUser] = useCurrentUser()
	const originalName = currentUser?.name ?? ''

	const [name, setName] = useState(originalName)
	const [isLoading, setIsLoading] = useState(false)

	const isDisabled = !name || originalName === name || isLoading

	const onSubmit = useCallback(
		async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault()
			if (!currentUser || isDisabled) return

			try {
				setIsLoading(true)
				await currentUser.updateName(name)
			} catch (error) {
				handleError(error)
			} finally {
				setIsLoading(false)
			}
		},
		[currentUser, name, isDisabled, setIsLoading]
	)

	const onChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setName(event.target.value)
		},
		[setName]
	)

	useEffect(() => {
		setName(originalName)
	}, [originalName, setName])

	return (
		<form className={styles.root} onSubmit={onSubmit}>
			<div className={styles.header}>
				<label className={styles.label} htmlFor={INPUT_ID}>
					Name
				</label>
				{!originalName || isLoading ? (
					<Loader
						className={styles.loader}
						size="16px"
						thickness="3px"
						color="#007aff"
					/>
				) : (
					<button className={styles.submit} disabled={isDisabled}>
						Save
					</button>
				)}
			</div>
			<input
				id={INPUT_ID}
				className={styles.input}
				type="name"
				readOnly={!originalName}
				value={name}
				onChange={onChange}
			/>
		</form>
	)
}

export default AccountSettingsName
