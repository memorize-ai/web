const DOTS = [0, 1, 2] as const

const TripleDots = ({ color }: { color: string }) => (
	<div className="triple-dots">
		{DOTS.map(i => <div key={i} style={{ background: color }} />)}
	</div>
)

export default TripleDots
