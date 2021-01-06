import { useContext, useEffect } from 'react'

import CreatorContext from 'contexts/Creators'
import User from 'models/User'
import { updateCreator, removeCreator } from 'actions'
import { compose } from 'lib/utils'

const useCreator = (uid: string | null | undefined): User | null => {
	const [creators, dispatch] = useContext(CreatorContext)
	const creator = (uid && creators[uid]) || null
	
	useEffect(() => {
		if (!uid || User.creatorObservers[uid] || creator)
			return
		
		User.creatorObservers[uid] = true
		
		User.loadCreatorForDeckWithId(uid, {
			updateCreator: compose(dispatch, updateCreator),
			removeCreator: compose(dispatch, removeCreator)
		})
	}, [uid, creator, dispatch])
	
	return creator
}

export default useCreator
