import { useEffect } from 'react'

export default (hide: boolean = true) => {
	useEffect(() => {
		if (!hide)
			return
		
		const { body } = document
		
		body.classList.add('hide-chat')
		
		return () => body.classList.remove('hide-chat')
	}, [hide])
}
