import { ReactNode } from 'react'
import { Svg } from 'react-optimized-image'

import Modal, { ModalShowingProps } from '.'

import times from 'images/icons/times.svg'

const ConfirmationModal = ({
	title,
	message,
	onConfirm,
	buttonText,
	buttonBackground,
	isShowing,
	setIsShowing
}: {
	title: string
	message: ReactNode
	onConfirm: () => void
	buttonText: string
	buttonBackground: string
} & ModalShowingProps) => (
	<Modal
		className="confirmation"
		isLazy={true}
		isShowing={isShowing}
		setIsShowing={setIsShowing}
	>
		<div className="header">
			<h2 className="title">{title}</h2>
			<button className="hide" onClick={() => setIsShowing(false)}>
				<Svg src={times} />
			</button>
		</div>
		<div className="content">
			<p>{message}</p>
			<button onClick={onConfirm} style={{ background: buttonBackground }}>
				{buttonText}
			</button>
		</div>
	</Modal>
)

export default ConfirmationModal
