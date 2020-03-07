import React, { HTMLAttributes } from 'react'

import capitalLogo from '../../images/capital-logo.png'

export default (props: HTMLAttributes<HTMLImageElement>) => (
	<img {...props} src={capitalLogo} alt="Logo" />
)
