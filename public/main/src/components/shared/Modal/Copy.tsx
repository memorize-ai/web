import React, { ReactNode, useState, useCallback, FormEvent, memo } from 'react'
import { useClipboard } from 'use-clipboard-copy'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition, faTimes } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import Modal, { ModalShowingProps } from '.'

import '../../../scss/components/Modal/Copy.scss'

const CopyModal = (
	{ title, message, icon, text, isShowing, setIsShowing }: {
		title: string
		message?: ReactNode
		icon: IconDefinition
		text: string
	} & ModalShowingProps
) => {
	const { copy } = useClipboard()
	const [didCopy, setDidCopy] = useState(false)
	
	const onSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		
		copy(text)
		setDidCopy(true)
	}, [copy, text, setDidCopy])
	
	return (
		<Modal
			className="copy"
			isLazy={false}
			isShowing={isShowing}
			setIsShowing={setIsShowing}
		>
			<div className="top">
				<div className="header">
					<h2 className="title">
						{title}
					</h2>
					<button
						className="hide"
						onClick={() => setIsShowing(false)}
					>
						<FontAwesomeIcon icon={faTimes} />
					</button>
				</div>
				{message && (
					<p className="message">{message}</p>
				)}
			</div>
			<form onSubmit={onSubmit}>
				<div className="text">
					<FontAwesomeIcon icon={icon} />
					<p>{text}</p>
				</div>
				<button type="submit" className={cx({ copied: didCopy })}>
					{didCopy ? 'Copied!' : 'Copy'}
				</button>
			</form>
		</Modal>
	)
}

export default memo(CopyModal)
