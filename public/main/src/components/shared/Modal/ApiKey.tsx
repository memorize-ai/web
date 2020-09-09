import React from 'react'
import { faKey } from '@fortawesome/free-solid-svg-icons'

import { ModalShowingProps } from '.'
import CopyModal from './Copy'

const ApiKeyModal = (
	{ value, isShowing, setIsShowing }: {
		value: string
	} & ModalShowingProps
) => (
	<CopyModal
		title="My API key"
		icon={faKey}
		text={value}
		isShowing={isShowing}
		setIsShowing={setIsShowing}
	/>
)

export default ApiKeyModal
