import { useCallback, FormEvent, useState, ReactNode } from 'react'
import cx from 'classnames'

import LoadingState from 'models/LoadingState'
import Head from '../Head'
import ButtonContent from './ButtonContent'

import styles from './index.module.scss'

export interface ConfirmationFormProps {
	url?: string
	title: string
	description: string
	loadingState: LoadingState
	submitMessage: string
	submitButtonText: string
	onSubmit: () => void
	children?: ReactNode
}

const ConfirmationForm = ({
	url,
	title,
	description,
	loadingState,
	submitMessage,
	submitButtonText,
	onSubmit: initialOnSubmit,
	children
}: ConfirmationFormProps) => {
	const [submitButtonWidth, setSubmitButtonWidth] = useState(
		undefined as number | undefined
	)

	const onSubmit = useCallback(
		(event: FormEvent<HTMLFormElement>) => {
			event.preventDefault()
			initialOnSubmit()
		},
		[initialOnSubmit]
	)

	const onSubmitButtonRef = useCallback(
		(button: HTMLButtonElement | null) => {
			setSubmitButtonWidth(button?.clientWidth)
		},
		[setSubmitButtonWidth]
	)

	return (
		<div className={styles.root}>
			<Head
				url={url}
				title={`${title} | memorize.ai`}
				description={description}
				breadcrumbs={url => [[{ name: title, url }]]}
			/>
			<div className={styles.content}>
				<h1 className={styles.title}>{submitMessage}</h1>
				{children}
				<form className={styles.form} onSubmit={onSubmit}>
					<p className={styles.submitMessage}>Are you sure?</p>
					<button
						ref={onSubmitButtonRef}
						className={cx(styles.submitButton, {
							[styles.loading]: loadingState === LoadingState.Loading,
							[styles.success]: loadingState === LoadingState.Success,
							[styles.error]: loadingState === LoadingState.Fail
						})}
						disabled={loadingState !== LoadingState.None}
						style={{ width: submitButtonWidth }}
					>
						<ButtonContent
							loadingState={loadingState}
							text={submitButtonText}
						/>
					</button>
				</form>
			</div>
		</div>
	)
}

export default ConfirmationForm
