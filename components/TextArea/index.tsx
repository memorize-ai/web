import { TextareaHTMLAttributes } from 'react'
import cx from 'classnames'

import styles from './index.module.scss'

export interface TextAreaProps
	extends TextareaHTMLAttributes<HTMLTextAreaElement> {
	className?: string
	minHeight?: string | number
	placeholder?: string
	value: string
	setValue: (value: string) => void
}

const TextArea = ({
	className,
	minHeight,
	placeholder,
	value,
	setValue,
	...props
}: TextAreaProps) => (
	<textarea
		{...props}
		className={cx(styles.root, className)}
		style={{ minHeight }}
		placeholder={placeholder}
		value={value}
		onChange={({ target: { value } }) => setValue(value)}
	/>
)

export default TextArea
