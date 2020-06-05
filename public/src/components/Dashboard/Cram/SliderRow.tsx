import React, { memo } from 'react'

const CramSliderRow = (
	{ fill, children: title }: {
		fill: number
		children: string
	}
) => (
	<tr>
		<td className="title">
			{title}
		</td>
		<td className="slider">
			<div>
				<div style={{ width: `${fill * 100}%` }} />
			</div>
		</td>
	</tr>
)

export default memo(CramSliderRow)
