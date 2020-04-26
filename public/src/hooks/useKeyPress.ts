import { useState, useEffect } from 'react'

export default (...targetKeyCodes: number[]) => {
	const [isPressed, setIsPressed] = useState(false)
	
	useEffect(() => {
		const keyDown = (event: KeyboardEvent) => {
			event.preventDefault()
			targetKeyCodes.includes(event.keyCode) && setIsPressed(true)
		}
		
		const keyUp = (event: KeyboardEvent) => {
			event.preventDefault()
			targetKeyCodes.includes(event.keyCode) && setIsPressed(false)
		}
		
		window.addEventListener('keydown', keyDown)
		window.addEventListener('keyup', keyUp)
		
		return () => {
			window.removeEventListener('keydown', keyDown)
			window.removeEventListener('keyup', keyUp)
		}
	}, [targetKeyCodes])
	
	return isPressed
}
