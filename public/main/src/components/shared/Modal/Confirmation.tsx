import React, { ReactNode, memo } from 'react'

import Modal, { ModalShowingProps } from '.'

import { ReactComponent as TimesIcon } from '../../../images/icons/times.svg'

import '../../../scss/components/Modal/Confirmation.scss'

const ConfirmationModal = (
	{ title, message, onConfirm, buttonText, buttonBackground, isShowing, setIsShowing }: {
		title: string
		message: ReactNode
		onConfirm: () => void
		buttonText: string
		buttonBackground: string
	} & ModalShowingProps
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

export default memo(ConfirmationModal)
