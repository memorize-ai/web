import { useCallback, FormEvent, useState, ReactNode } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import LoadingState from 'models/LoadingState'
import Head from './Head'
import Loader from './Loader'

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
	
	const onSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		initialOnSubmit()
	}, [initialOnSubmit])
	
	const onSubmitButtonRef = useCallback((button: HTMLButtonElement | null) => {
		setSubmitButtonWidth(button?.clientWidth)
	}, [setSubmitButtonWidth])
	
	return (
		<div className="confirmation-form">
			<Head
				url={url}
				title={`${title} | memorize.ai`}
				description={description}
				breadcrumbs={url => [
					[{ name: title, url }]
				]}
			/>
			<div className="content">
				<h1 className="title">
					{submitMessage}
				</h1>
				{children}
				<form onSubmit={onSubmit}>
					<p className="submit-message">
						Are you sure?
					</p>
					<button
						ref={onSubmitButtonRef}
						className={cx('submit-button', {
							loading: loadingState === LoadingState.Loading,
							success: loadingState === LoadingState.Success,
							error: loadingState === LoadingState.Fail
						})}
						disabled={loadingState !== LoadingState.None}
						style={{ width: submitButtonWidth }}
					>
						{(() => {
							switch (loadingState) {
								case LoadingState.None:
									return submitButtonText
								case LoadingState.Loading:
									return <Loader size="20px" thickness="4px" color="white" />
								case LoadingState.Success:
									return <FontAwesomeIcon icon={faCheck} />
								case LoadingState.Fail:
									return <FontAwesomeIcon icon={faTimes} />
							}
						})()}
					</button>
				</form>
			</div>
		</div>
	)
}

export default ConfirmationForm
