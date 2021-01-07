import cx from 'classnames'

const CramSliderRow = ({
	fill,
	children: title
}: {
	fill: number
	children: string
}) => (
	<tr>
		<td className={cx('title', { disabled: !fill })}>{title}</td>
		<td className="slider">
			<div>
				<div style={{ width: `${fill * 100}%` }} />
			</div>
		</td>
	</tr>
)

export default CramSliderRow
