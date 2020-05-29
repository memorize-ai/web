import React, { PropsWithChildren, useRef, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import useKeyPress from 'hooks/useKeyPress'

import styles from 'styles/components/Modal/index.module.scss'

export default (
	{ className, isLazy, isShowing, setIsShowing, children }: PropsWithChildren<{
		className?: string
		isLazy: boolean
		isShowing: boolean
		setIsShowing: (isShowing: boolean) => void
	}>
) => {
	const element = useRef(null as HTMLDivElement | null)
	const content = useRef(null as HTMLDivElement | null)
	
	const shouldHide = useKeyPress(27) // Escape
	const [shouldShowContent, setShouldShowContent] = useState(!isLazy)
	
	if (!element.current && process.browser) {
		element.current = document.createElement('div')
	}
	
	useEffect(() => {
		const { body } = document
		const { current } = element
		
		current.classList.add('modal')
		className && current.classList.add(className)
		
		current.setAttribute('role', 'presentation')
		
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
		
		body.classList.add('modal-showing')
		body.addEventListener('click', onClick)
		
		return () => {
			body.classList.remove('modal-showing')
			body.removeEventListener('click', onClick)
		}
	}, [isShowing]) // eslint-disable-line
	
	useEffect(() => {
		if (shouldHide)
			setIsShowing(false)
	}, [shouldHide]) // eslint-disable-line
	
	return element.current && createPortal((
		<div ref={content} className="content">
			{shouldShowContent && children}
		</div>
	), element.current)
}
