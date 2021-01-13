import styles from './index.module.scss'

const DOTS = [0, 1, 2] as const

export interface TripleDotsProps {
	className?: string
	color: string
}

const TripleDots = ({ className, color }: TripleDotsProps) => (
	<div className={className}>
		{DOTS.map(i => (
			<div key={i} className={styles.dot} style={{ background: color }} />
		))}
	</div>
)

export default TripleDots
