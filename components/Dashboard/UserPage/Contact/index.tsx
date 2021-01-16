import { useState, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComments } from '@fortawesome/free-solid-svg-icons'

import User from 'models/User'
import LoadingState from 'models/LoadingState'
import useLayoutAuthState from 'hooks/useLayoutAuthState'
import useContactUserState from 'hooks/useContactUserState'
import useAuthModal from 'hooks/useAuthModal'
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

	const show = useCallback(() => {
		isSignedIn ? setIsShowing(true) : setIsAuthModalShowing(true)
	}, [isSignedIn, setIsShowing, setIsAuthModalShowing])

	return loadingState === LoadingState.Success ? (
		<button className={styles.root} onClick={show}>
			<FontAwesomeIcon className={styles.icon} icon={faComments} />
			Chat
			<ContactUserModal
				subjectPlaceholder="What an amazing profile!"
				bodyPlaceholder={`Hi ${user.name ?? 'Anonymous'}...`}
				user={user}
				isShowing={isShowing}
				setIsShowing={setIsShowing}
			/>
		</button>
	) : null
}

export default UserPageContact
