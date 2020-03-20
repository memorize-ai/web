import React, { HTMLAttributes } from 'react'

import '../../scss/components/CreateCardPopUp/HorizontalScrollingList.scss'

export default ({ children, ...props }: HTMLAttributes<HTMLDivElement>) => (
	<div {...props} className="create-card-pop-up horizontal-scrolling-list">
		{children}
	</div>
)
