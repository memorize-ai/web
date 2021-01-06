import Row from './SliderRow'
import { safeDivide } from 'lib/utils'

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
			<Row fill={safeDivide(mastered, total)}>Mastered</Row>
			<Row fill={safeDivide(seen, total)}>Seen</Row>
			<Row fill={safeDivide(unseen, total)}>Unseen</Row>
		</tbody>
	</table>
)

export default CramSliders
