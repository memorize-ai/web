import React from 'react'

export enum DescriptionsSide {
	Left,
	Right
}

export interface Description {
	title: string
	body: string
	margin: number
}

export default ({ side, descriptions, ...props }: { side: DescriptionsSide, descriptions: Description[] }) => (
	<div {...props} className="descriptions flex flex-col h-full">
		{descriptions.map(({ title, body, margin }, index) => (
			<div
				key={index}
				className="description text-white"
				style={
					side === DescriptionsSide.Left
						? { marginRight: `${margin}px` }
						: { marginLeft: `${margin}px` }
				}
			>
				<h1>{title}</h1>
				{body
					.split('\n')
					.map(line => line.trim())
					.filter(line => line)
					.map((line, index) => (
						<p key={index}>{line}</p>
					))
				}
			</div>
		))}
	</div>
)
