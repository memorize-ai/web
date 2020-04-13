import React, { PropsWithChildren, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

import useKeyPress from '../../hooks/useKeyPress'

import '../../scss/components/Modal.scss'

export default (
	{ className, isShowing, setIsShowing, children }: PropsWithChildren<{
		className?: string
		isShowing: boolean
		setIsShowing: (isShowing: boolean) => void
	}>
) => {
	const element = useRef(document.createElement('div'))
	const shouldHide = useKeyPress(27)
	
	useEffect(() => {
		const { body } = document
		const { current } = element
		
		current.classList.add('modal')
		className && current.classList.add(className)
		
		body.appendChild(current)
		
		return () => void body.removeChild(current)
	}, [className])
	
	useEffect(() => {
		const { current } = element
		
		current.classList[isShowing ? 'add' : 'remove']('showing')
		
		isShowing
			? current.removeAttribute('aria-hidden')
			: current.setAttribute('aria-hidden', 'true')
	}, [isShowing])
	
	useEffect(() => {
		if (shouldHide)
			setIsShowing(false)
	}, [shouldHide, setIsShowing])
	
	return createPortal((
		<div className="content">{children}</div>
	), element.current)
}
