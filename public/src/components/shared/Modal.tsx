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
	const content = useRef(null as HTMLDivElement | null)
	
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
		
		if (!isShowing)
			return
		
		const { body } = document
		
		const onClick = ({ target }: Event) => {
			const { current } = content
			
			if (!current || target === current || current.contains(target as Node | null))
				return
			
			setIsShowing(false)
		}
		
		body.classList.add('clipped')
		body.addEventListener('click', onClick)
		
		return () => {
			body.classList.remove('clipped')
			body.removeEventListener('click', onClick)
		}
	}, [isShowing, setIsShowing])
	
	useEffect(() => {
		if (shouldHide)
			setIsShowing(false)
	}, [shouldHide, setIsShowing])
	
	return createPortal((
		<div ref={content} className="content">
			{children}
		</div>
	), element.current)
}
