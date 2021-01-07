import { useEffect } from 'react'

const CLASS = 'hide-chat'

const hideChat = (hide = true) => {
	useEffect(() => {
		if (!hide)
			return
		
		const { classList } = document.body
		
		classList.add(CLASS)
		return () => classList.remove(CLASS)
	}, [hide])
}

export default hideChat
