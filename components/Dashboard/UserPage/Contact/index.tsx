import { useState, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComments } from '@fortawesome/free-solid-svg-icons'

import User from 'models/User'
import LoadingState from 'models/LoadingState'
import useLayoutAuthState from 'hooks/useLayoutAuthState'
import useContactUserState from 'hooks/useContactUserState'
import useAuthModal from 'hooks/useAuthModal'
import Loader from 'components/Loader'
import ContactUserModal from 'components/Modal/ContactUser'

import styles from './index.module.scss'

export interface UserPageContactProps {
	user: User
}

const UserPageContact = ({ user }: UserPageContactProps) => {
	const isSignedIn = useLayoutAuthState()
	const loadingState = useContactUserState(user)

	const [isShowing, setIsShowing] = useState(false)
	const { setIsShowing: setIsAuthModalShowing } = useAuthModal()

	const didFail = loadingState === LoadingState.Fail
	const isLoading = loadingState === LoadingState.Loading

	const show = useCallback(() => {
		isSignedIn ? setIsShowing(true) : setIsAuthModalShowing(true)
	}, [isSignedIn, setIsShowing, setIsAuthModalShowing])

	return didFail ? null : (
		<button className={styles.root} onClick={show} disabled={isLoading}>
			{isLoading ? (
				<Loader
					className={styles.loader}
					size="20px"
					thickness="4px"
					color="white"
				/>
			) : (
				<FontAwesomeIcon className={styles.icon} icon={faComments} />
			)}
			Chat
			<ContactUserModal
				subjectPlaceholder="What an amazing profile!"
				bodyPlaceholder={`Hi ${user.name ?? 'Anonymous'}...`}
				user={user}
				isShowing={isShowing}
				setIsShowing={setIsShowing}
			/>
		</button>
	)
}

export default UserPageContact
