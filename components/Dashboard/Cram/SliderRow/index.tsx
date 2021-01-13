import cx from 'classnames'

import styles from './index.module.scss'

export interface CramSliderRowProps {
	fill: number
	children: string
}

const CramSliderRow = ({ fill, children: title }: CramSliderRowProps) => (
	<tr>
		<td className={cx(styles.title, { [styles.disabled]: !fill })}>{title}</td>
		<td className={styles.slider}>
			<div className={styles.sliderContent}>
				<div
					className={styles.sliderInnerContent}
					style={{ width: `${fill * 100}%` }}
				/>
			</div>
		</td>
	</tr>
)

export default CramSliderRow
