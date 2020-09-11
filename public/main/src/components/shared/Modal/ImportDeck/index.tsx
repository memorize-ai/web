import React, { PropsWithChildren, useCallback, FormEvent } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import Modal, { ModalShowingProps } from '..'

export interface ImportDeckModalProps extends PropsWithChildren<ModalShowingProps> {
	title: string
	onSubmit: () => void
}

const ImportDeckModal = ({
	title,
	onSubmit: _onSubmit,
	isShowing,
	setIsShowing,
	children
}: ImportDeckModalProps) => {
	const onSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		_onSubmit()
	}, [_onSubmit])
	
	return (
		<Modal
			isLazy={false}
			isShowing={isShowing}
			setIsShowing={setIsShowing}
		>
			<div className="top">
				<h2 className="title">{title}</h2>
				<button
					className="hide"
					onClick={() => setIsShowing(false)}
				>
					<FontAwesomeIcon icon={faTimes} />
				</button>
			</div>
			<form onSubmit={onSubmit}>
				{children}
			</form>
		</Modal>
	)
}

export default ImportDeckModal
