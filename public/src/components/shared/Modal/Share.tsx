import React, { ReactNode, useState, useCallback, FormEvent } from 'react'
import { useClipboard } from 'use-clipboard-copy'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faLink } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import Modal from '.'

import '../../../styles/components/Modal/Share.scss'

export default (
	{ title, message, url, isShowing, setIsShowing }: {
		title: string
		message?: ReactNode
		url: string
		isShowing: boolean
		setIsShowing: (isShowing: boolean) => void
	}
) => {
	const { copy } = useClipboard()
	const [didCopy, setDidCopy] = useState(false)
	
	const onSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		
		copy(url)
		setDidCopy(true)
	}, [copy, url])
	
	return (
		<Modal
			className="share"
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
				<div className="url">
					<FontAwesomeIcon icon={faLink} />
					<p>{url}</p>
				</div>
				<button type="submit" className={cx({ copied: didCopy })}>
					{didCopy ? 'Copied!' : 'Copy'}
				</button>
			</form>
		</Modal>
	)
}
