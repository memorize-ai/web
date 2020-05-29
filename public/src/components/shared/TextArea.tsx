import React, { TextareaHTMLAttributes } from 'react'
import cx from 'classnames'

import styles from '../../styles/components/TextArea.module.scss'

export default (
	{ className, minHeight, placeholder, value, setValue, ...props }: {
		className?: string
		minHeight?: string | number
		placeholder?: string
		value: string
		setValue: (value: string) => void
	} & TextareaHTMLAttributes<HTMLTextAreaElement>
) => (
	<textarea
		{...props}
		className={cx(styles.root, className)}
		style={{ minHeight }}
		placeholder={placeholder}
		value={value}
		onChange={({ target: { value } }) => setValue(value)}
	/>
)
