import React, { useCallback, useState, ChangeEvent } from 'react'

import firebase from '../../../../firebase'
import { ModalShowingProps } from '..'
import Modal from '.'

import 'firebase/functions'

export interface ImportDeckQuizletUrlModalData {
	url: string
	image: string
	name: string
	existing: boolean
}

export interface ImportDeckQuizletUrlModalProps extends ModalShowingProps {
	onSubmit: (data: ImportDeckQuizletUrlModalData) => void
}

const getImportDeckDataFromQuizlet = firebase.functions().httpsCallable('getImportDeckDataFromQuizlet')

const ImportDeckQuizletUrlModal = ({
	onSubmit: _onSubmit,
	isShowing,
	setIsShowing
}: ImportDeckQuizletUrlModalProps) => {
	const [url, setUrl] = useState('')
	
	const onSubmit = useCallback(async () => {
		try {
			_onSubmit(await getImportDeckDataFromQuizlet(url) as any)
		} catch (error) {
			console.log(error)
		}
	}, [url, _onSubmit])
	
	const onUrlInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		setUrl(event.target.value)
	}, [setUrl])
	
	return (
		<Modal
			title="Import from Quizlet"
			onSubmit={onSubmit}
			isShowing={isShowing}
			setIsShowing={setIsShowing}
		>
			<input
				placeholder="Quizlet set URL"
				value={url}
				onChange={onUrlInputChange}
			/>
		</Modal>
	)
}

export default ImportDeckQuizletUrlModal
