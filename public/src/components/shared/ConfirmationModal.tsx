import React, { ReactNode } from 'react'

import Modal from './Modal'

import { ReactComponent as TimesIcon } from '../../images/icons/times.svg'

import '../../scss/components/ConfirmationModal.scss'

export default (
	{ title, message, onConfirm, buttonText, buttonBackground, isShowing, setIsShowing }: {
		title: string
		message: ReactNode
		onConfirm: () => void
		buttonText: string
		buttonBackground: string
		isShowing: boolean
		setIsShowing: (isShowing: boolean) => void
	}
) => (
	<Modal
		className="confirmation"
		isLazy={true}
		isShowing={isShowing}
		setIsShowing={setIsShowing}
	>
		<div className="header">
			<h2 className="title">{title}</h2>
			<button
				className="hide"
				onClick={() => setIsShowing(false)}
			>
				<TimesIcon />
			</button>
		</div>
		<div className="content">
			<p>{message}</p>
			<button
				onClick={onConfirm}
				style={{ background: buttonBackground }}
			>
				{buttonText}
			</button>
		</div>
	</Modal>
)
