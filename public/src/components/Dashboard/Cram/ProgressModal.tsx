import React, { memo } from 'react'

import Modal from '../../shared/Modal'

const CramProgressModal = (
	{ isShowing, setIsShowing }: {
		isShowing: boolean
		setIsShowing: (isShowing: boolean) => void
	}
) => (
	<Modal
		className="cram-progress"
		isLazy
		isShowing={isShowing}
		setIsShowing={setIsShowing}
	>
		Cram progress
	</Modal>
)

export default memo(CramProgressModal)
