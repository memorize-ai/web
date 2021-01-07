import LoadingState from 'models/LoadingState'
import useCurrentUser from './useCurrentUser'
import { expectsSignIn } from 'lib/utils'

const useAuthState = () => {
	const [currentUser, currentUserLoadingState] = useCurrentUser()

	return currentUserLoadingState === LoadingState.Success
		? Boolean(currentUser)
		: expectsSignIn()
}

export default useAuthState
