import LoadingState from '../models/LoadingState'
import useCurrentUser from './useCurrentUser'
import { expectsSignIn } from '../utils'

export default () => {
	const [currentUser, currentUserLoadingState] = useCurrentUser()
	
	return Boolean(
		currentUserLoadingState === LoadingState.Success
			? currentUser
			: expectsSignIn()
	)
}
