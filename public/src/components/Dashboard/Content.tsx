import React, { PropsWithChildren } from 'react'

import '../../scss/components/Dashboard/Content.scss'

export default ({ children }: PropsWithChildren<{}>) => (
	<div className="children">{children}</div>
)
