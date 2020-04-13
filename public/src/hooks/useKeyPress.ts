import { useState, useEffect } from 'react'

export default (targetKeyCode: number) => {
	const [isPressed, setIsPressed] = useState(false)
	
	useEffect(() => {
		const keyDown = ({ keyCode }: KeyboardEvent) =>
			keyCode === targetKeyCode && setIsPressed(true)
		
		const keyUp = ({ keyCode }: KeyboardEvent) =>
			keyCode === targetKeyCode && setIsPressed(false)
		
		window.addEventListener('keydown', keyDown)
		window.addEventListener('keyup', keyUp)
		
		return () => {
			window.removeEventListener('keydown', keyDown)
			window.removeEventListener('keyup', keyUp)
		}
	}, [targetKeyCode])
	
	return isPressed
}
