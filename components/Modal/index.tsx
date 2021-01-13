import { ReactNode, useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import cx from 'classnames'

import useKeyPress from 'hooks/useKeyPress'

import styles from './index.module.scss'

const HIDE_KEYS = ['Escape']

export interface ModalShowingProps {
	isShowing: boolean
	setIsShowing(isShowing: boolean): void
}

export interface ModalProps extends ModalShowingProps {
	className?: string
	children?: ReactNode
}

const Modal = ({
	className,
	isShowing,
	setIsShowing,
	children
}: ModalProps) => {
	const [element, setElement] = useState(null as HTMLDivElement | null)
	const content = useRef(null as HTMLDivElement | null)

	const shouldHide = useKeyPress(HIDE_KEYS)

	useEffect(() => {
		setElement(document.createElement('div'))
	}, [setElement])

	useEffect(() => {
		if (!element) return

		element.classList.add(styles.root)
		element.setAttribute('role', 'presentation')

		const { body } = document
		body.appendChild(element)

		return () => {
			body.removeChild(element)
		}
	}, [element])

	useEffect(() => {
		if (!element) return
		element.setAttribute('aria-hidden', (!isShowing).toString())

		if (!isShowing) return

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
			<div ref={content} className={cx(styles.content, className)}>
				{children}
			</div>,
			element
		)
	)
}

export default Modal
