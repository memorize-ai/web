import { useState, useEffect } from 'react'

export default (...targetKeyCodes: number[]) => {
	const [isPressed, setIsPressed] = useState(false)
	
	useEffect(() => {
		if (!process.browser)
			return
		
		const keyDown = ({ keyCode }: KeyboardEvent) =>
			targetKeyCodes.includes(keyCode) && setIsPressed(true)
		
		const keyUp = ({ keyCode }: KeyboardEvent) =>
			targetKeyCodes.includes(keyCode) && setIsPressed(false)
		
		window.addEventListener('keydown', keyDown)
		window.addEventListener('keyup', keyUp)
		
		return () => {
			window.removeEventListener('keydown', keyDown)
			window.removeEventListener('keyup', keyUp)
		}
	}, []) // eslint-disable-line
	
	return isPressed
}
