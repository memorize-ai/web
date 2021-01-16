import { useRecoilValue } from 'recoil'

import newUserImageUrlState from 'state/newUserImageUrl'
import useCurrentUser from './useCurrentUser'

const useUserImageUrl = () => {
	const newImageUrl = useRecoilValue(newUserImageUrlState)
	const [currentUser] = useCurrentUser()

	return newImageUrl === undefined
		? currentUser && currentUser.imageUrl
		: newImageUrl
}

export default useUserImageUrl
