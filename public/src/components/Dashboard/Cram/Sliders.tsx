import React, { memo } from 'react'

import Row from './SliderRow'

const CramSliders = (
	{ mastered, seen, unseen, total }: {
		mastered: number
		seen: number
		unseen: number
		total: number
	}
) => (
	<table className="sliders">
		<tbody>
			<Row fill={mastered / total}>Mastered</Row>
			<Row fill={seen / total}>Seen</Row>
			<Row fill={unseen / total}>Unseen</Row>
		</tbody>
	</table>
)

export default memo(CramSliders)
