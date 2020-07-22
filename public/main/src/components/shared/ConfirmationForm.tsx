import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'

import LoadingState from '../../models/LoadingState'
import Loader from './Loader'

import '../../scss/components/ConfirmationForm.scss'

export interface ConfirmationFormProps {
	loadingState: LoadingState
	submitMessage: string
	submitButtonText: string
	onSubmit: () => void
}

const ConfirmationForm = ({
	loadingState,
	submitMessage,
	submitButtonText,
	onSubmit
}: ConfirmationFormProps) => (
	<div className="confirmation-form">
		<div className="content">
			<h1 className="title">
				{submitMessage}
			</h1>
			<form onSubmit={onSubmit}>
				<p className="submit-message">
					{submitMessage}
				</p>
				<button
					className="submit"
					disabled={loadingState !== LoadingState.None}
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

export default ConfirmationForm
