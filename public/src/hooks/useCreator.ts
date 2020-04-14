import { useContext, useEffect } from 'react'

import CreatorContext from '../contexts/Creators'
import User from '../models/User'
import { updateCreator, removeCreator } from '../actions'
import { compose } from '../utils'

export default (uid: string): User | null => {
	const [{ [uid]: creator }, dispatch] = useContext(CreatorContext)
	
	useEffect(() => {
		if (User.creatorObservers[uid])
			return
		
		User.creatorObservers[uid] = true
		
		User.loadCreatorForDeckWithId(uid, {
			updateCreator: compose(dispatch, updateCreator),
			removeCreator: compose(dispatch, removeCreator)
		})
	}, [uid]) // eslint-disable-line
	
	return creator ?? null
}
