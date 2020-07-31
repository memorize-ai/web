import React from 'react'

import Modal, { ModalShowingProps } from '..'

const ImportDeckTextModal = ({ isShowing, setIsShowing }: ModalShowingProps) => {
	return (
		<Modal
			isLazy={false}
			isShowing={isShowing}
			setIsShowing={setIsShowing}
		>
			
		</Modal>
	)
}

export default ImportDeckTextModal
