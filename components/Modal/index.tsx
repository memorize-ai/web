import { PropsWithChildren, useRef, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import useKeyPress from 'hooks/useKeyPress'

const HIDE_KEYS = ['Escape']

export interface ModalShowingProps {
	isShowing: boolean
	setIsShowing: (isShowing: boolean) => void
}

export interface ModalProps extends ModalShowingProps {
	className?: string
	isLazy: boolean
}

const Modal = ({
	className,
	isLazy,
	isShowing,
	setIsShowing,
	children
}: PropsWithChildren<ModalProps>) => {
	const [element, setElement] = useState(null as HTMLDivElement | null)
	const content = useRef(null as HTMLDivElement | null)

	const shouldHide = useKeyPress(HIDE_KEYS)
	const [shouldShowContent, setShouldShowContent] = useState(!isLazy)

	useEffect(() => {
		setElement(document.createElement('div'))
	}, [setElement])

	useEffect(() => {
		if (!element) return

		const { body } = document

		element.classList.add('modal')
		element.setAttribute('role', 'presentation')

		if (className) element.classList.add(className)

		body.appendChild(element)

		return () => {
			body.removeChild(element)
		}
	}, [element, className])

	useEffect(() => {
		if (!element) return

		element.classList[isShowing ? 'add' : 'remove']('showing')
		element.setAttribute('aria-hidden', (!isShowing).toString())

		if (!isShowing) return

		setShouldShowContent(true)

		const { body } = document

		const onClick = ({ target }: Event) => {
			const { current } = content

			if (
				!current ||
				target === current ||
				current.contains(target as Node | null)
			)
				return

			setIsShowing(false)
		}

		body.classList.add('modal-showing')
		body.addEventListener('click', onClick)

		return () => {
			body.classList.remove('modal-showing')
			body.removeEventListener('click', onClick)
		}
	}, [element, isShowing, setIsShowing])

	useEffect(() => {
		if (shouldHide) setIsShowing(false)
	}, [shouldHide, setIsShowing])

	return (
		element &&
		createPortal(
			<div ref={content} className="content">
				{shouldShowContent && children}
			</div>,
			element
		)
	)
}

export default Modal
