import { TextareaHTMLAttributes } from 'react'
import cx from 'classnames'

const TextArea = ({
	className,
	minHeight,
	placeholder,
	value,
	setValue,
	...props
}: {
	className?: string
	minHeight?: string | number
	placeholder?: string
	value: string
	setValue: (value: string) => void
} & TextareaHTMLAttributes<HTMLTextAreaElement>) => (
	<textarea
		{...props}
		className={cx('textarea', className)}
		style={{ minHeight }}
		placeholder={placeholder}
		value={value}
		onChange={({ target: { value } }) => setValue(value)}
	/>
)

export default TextArea
