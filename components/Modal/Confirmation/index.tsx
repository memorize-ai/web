import { ReactNode, FormEvent, useCallback } from 'react'
import { Svg } from 'react-optimized-image'

import Modal, { ModalShowingProps } from '..'

import times from 'images/icons/times.svg'
import styles from './index.module.scss'

export interface ConfirmationModalProps extends ModalShowingProps {
	title: string
	message: ReactNode
	onConfirm(): void
	buttonText: string
	buttonBackground: string
}

const ConfirmationModal = ({
	title,
	message,
	onConfirm,
	buttonText,
	buttonBackground,
	isShowing,
	setIsShowing
}: ConfirmationModalProps) => {
	const onSubmit = useCallback(
		(event: FormEvent<HTMLFormElement>) => {
			event.preventDefault()
			onConfirm()
		},
		[onConfirm]
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
				<p className={styles.message}>{message}</p>
				<button
					className={styles.submit}
					style={{ background: buttonBackground }}
				>
					{buttonText}
				</button>
			</form>
		</Modal>
	)
}

export default ConfirmationModal
