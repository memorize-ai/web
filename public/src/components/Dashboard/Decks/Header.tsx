import React from 'react'

import Deck from '../../../models/Deck'

export default ({ deck }: { deck: Deck | null }) => {
	return (
		<div className="header">
			{deck?.name}
		</div>
	)
}
