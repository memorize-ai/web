import React, { useCallback, FormEvent, useState, PropsWithChildren } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import LoadingState from '../../models/LoadingState'
import Head from './Head'
import Loader from './Loader'

import '../../scss/components/ConfirmationForm.scss'

export interface ConfirmationFormProps extends PropsWithChildren<{}> {
	title: string
	description: string
	loadingState: LoadingState
	submitMessage: string
	submitButtonText: string
	onSubmit: () => void
}

const ConfirmationForm = ({
	title,
	description,
	loadingState,
	submitMessage,
	submitButtonText,
	onSubmit: _onSubmit,
	children
}: ConfirmationFormProps) => {
	const [submitButtonWidth, setSubmitButtonWidth] = useState(
		undefined as number | undefined
	)
	
	const onSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		_onSubmit()
	}, [_onSubmit])
	
	const onSubmitButtonRef = useCallback((button: HTMLButtonElement | null) => {
		setSubmitButtonWidth(button?.clientWidth)
	}, [setSubmitButtonWidth])
	
	return (
		<div className="confirmation-form">
			<Head
				title={`${title} | memorize.ai`}
				description={description}
				breadcrumbs={[
					[
						{
							name: title,
							url: window.location.href
						}
					]
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
