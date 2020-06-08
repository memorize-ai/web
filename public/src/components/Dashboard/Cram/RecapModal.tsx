import React, { memo } from 'react'

import Modal from '../../shared/Modal'

const CramRecapModal = (
	{ data, backUrl, isShowing, setIsShowing }: {
		data: {} | null
		backUrl: string
		isShowing: boolean
		setIsShowing: (isShowing: boolean) => void
	}
) => (
	<Modal
		className="cram-recap"
		isLazy={false}
		isShowing={isShowing}
		setIsShowing={setIsShowing}
	>
		{JSON.stringify(data ?? {})}
	</Modal>
)

export default memo(CramRecapModal)
