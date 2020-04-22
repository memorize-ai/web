import React, { PropsWithChildren, useRef, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import useKeyPress from '../../../hooks/useKeyPress'
import { ROOT_ELEMENT } from '../../../constants'

import '../../../scss/components/Modal/index.scss'

export default (
	{ className, isLazy, isShowing, setIsShowing, children }: PropsWithChildren<{
		className?: string
		isLazy: boolean
		isShowing: boolean
		setIsShowing: (isShowing: boolean) => void
	}>
) => {
	const element = useRef(document.createElement('div'))
	const content = useRef(null as HTMLDivElement | null)
	
	const shouldHide = useKeyPress(27) // Escape
	const [shouldShowContent, setShouldShowContent] = useState(!isLazy)
	
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
		
		setShouldShowContent(true)
		
		const { body } = document
		
		const onClick = ({ target }: Event) => {
			const { current } = content
			
			if (!current || target === current || current.contains(target as Node | null))
				return
			
			setIsShowing(false)
		}
		
		body.classList.add('clipped')
		ROOT_ELEMENT?.classList.add('blurred')
		
		body.addEventListener('click', onClick)
		
		return () => {
			body.classList.remove('clipped')
			ROOT_ELEMENT?.classList.remove('blurred')
			
			body.removeEventListener('click', onClick)
		}
	}, [isShowing, setIsShowing])
	
	useEffect(() => {
		if (shouldHide)
			setIsShowing(false)
	}, [shouldHide, setIsShowing])
	
	return createPortal((
		<div ref={content} className="content">
			{shouldShowContent && children}
		</div>
	), element.current)
}
