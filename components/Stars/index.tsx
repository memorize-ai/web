import Star from './Star'

const STARS = [0, 1, 2, 3, 4] as const

const Stars = ({ children: rating }: { children: number }) => (
	<div className="stars">
		{STARS.map(offset => (
			<Star
				key={offset}
				fill={Math.min(1, Math.max(0, rating - offset)) * 100}
			/>
		))}
	</div>
)

export default Stars
