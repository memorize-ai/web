import React, { memo } from 'react'

import { CramProgressData } from './useCramState'
import Modal from '../../shared/Modal'

const CramProgressModal = (
	{ data, isShowing, setIsShowing }: {
		data: CramProgressData | null
		isShowing: boolean
		setIsShowing: (isShowing: boolean) => void
	}
) => (
	<Modal
		className="cram-progress"
		isLazy={false}
		isShowing={isShowing}
		setIsShowing={setIsShowing}
	>
		{JSON.stringify(data ?? {})}
	</Modal>
)

export default memo(CramProgressModal)
