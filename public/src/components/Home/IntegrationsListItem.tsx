import React from 'react'

import checkImage from '../../images/check.png'

export default ({ title }: { title: string }) => (
	<div>
		<img src={checkImage} alt="Checkmark" />
		<p>{title}</p>
	</div>
)
