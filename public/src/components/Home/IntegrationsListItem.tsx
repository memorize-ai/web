import React from 'react'

import checkImage from '../../images/check.png'

export default ({ title }: { title: string }) => (
	<div className="flex">
		<img src={checkImage} alt="Checkmark" />
		<p className="text-dark-gray">{title}</p>
	</div>
)
