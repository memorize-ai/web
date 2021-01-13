import { ReactNode, useState, useCallback, FormEvent } from 'react'
import copy from 'copy-to-clipboard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition, faTimes } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import Modal, { ModalShowingProps } from '..'
import styles from './index.module.scss'

export interface CopyModalProps extends ModalShowingProps {
	title: string
	message?: ReactNode
	icon: IconDefinition
	text: string
}

const CopyModal = ({
	title,
	message,
	icon,
	text,
	isShowing,
	setIsShowing
}: CopyModalProps) => {
	const [didCopy, setDidCopy] = useState(false)

	const onSubmit = useCallback(
		(event: FormEvent<HTMLFormElement>) => {
			event.preventDefault()

			copy(text)
			setDidCopy(true)
		},
		[text, setDidCopy]
	)

	return (
		<Modal
			className={styles.root}
			isShowing={isShowing}
			setIsShowing={setIsShowing}
		>
			<div className={styles.top}>
				<div className={styles.header}>
					<h2 className={styles.title}>{title}</h2>
					<button className={styles.hide} onClick={() => setIsShowing(false)}>
						<FontAwesomeIcon icon={faTimes} />
					</button>
				</div>
				{message && <p className={styles.message}>{message}</p>}
			</div>
			<form className={styles.form} onSubmit={onSubmit}>
				<div className={styles.textContainer}>
					<FontAwesomeIcon className={styles.icon} icon={icon} />
					<p className={styles.text}>{text}</p>
				</div>
				<button className={cx(styles.copy, { [styles.copied]: didCopy })}>
					{didCopy ? 'Copied!' : 'Copy'}
				</button>
			</form>
		</Modal>
	)
}

export default CopyModal
