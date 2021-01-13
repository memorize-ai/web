import { useCallback, FormEvent } from 'react'
import { Svg } from 'react-optimized-image'
import Modal, { ModalShowingProps } from 'components/Modal'

import times from 'images/icons/times.svg'
import styles from './index.module.scss'

export interface InputModalProps extends ModalShowingProps {
	title: string
	placeholder: string
	buttonText: string
	buttonBackground?: string
	value: string
	setValue(value: string): void
	onSubmit(): void
	isDisabled: boolean
}

const InputModal = ({
	title,
	placeholder,
	buttonText,
	buttonBackground = '',
	value,
	setValue,
	onSubmit: finalize,
	isDisabled,
	isShowing,
	setIsShowing
}: InputModalProps) => {
	const onInputRef = useCallback(
		(input: HTMLInputElement | null) => {
			input?.[isShowing ? 'focus' : 'blur']()
		},
		[isShowing]
	)

	const onSubmit = useCallback(
		(event: FormEvent<HTMLFormElement>) => {
			event.preventDefault()
			if (!isDisabled) finalize()
		},
		[isDisabled, finalize]
	)

	return (
		<Modal
			className={styles.root}
			isShowing={isShowing}
			setIsShowing={setIsShowing}
		>
			<div className={styles.header}>
				<h2 className={styles.title}>{title}</h2>
				<button className={styles.hide} onClick={() => setIsShowing(false)}>
					<Svg src={times} />
				</button>
			</div>
			<form className={styles.form} onSubmit={onSubmit}>
				<input
					ref={onInputRef}
					className={styles.input}
					placeholder={placeholder}
					value={value}
					onChange={({ target }) => setValue(target.value)}
				/>
				<button
					className={styles.submit}
					disabled={isDisabled}
					style={{ background: buttonBackground }}
				>
					{buttonText}
				</button>
			</form>
		</Modal>
	)
}

export default InputModal
