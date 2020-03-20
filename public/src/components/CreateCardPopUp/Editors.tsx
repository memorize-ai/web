import React, { useState } from 'react'

import Deck from '../../models/Deck'
import Section from '../../models/Section'
import Card from '../../models/Card'
import LoadingState from '../../models/LoadingState'
import CKEditor from '../shared/CKEditor'
import Button from '../shared/Button'

import '../../scss/components/CreateCardPopUp/Editors.scss'

export default (
	{ deck, section, text }: {
		deck: Deck
		section: Section
		text: string
	}
) => {
	const [front, setFront] = useState(text)
	const [back, setBack] = useState('')
	const [publishLoadingState, setPublishLoadingState] = useState(LoadingState.None)
	
	const isPublishButtonLoading = publishLoadingState === LoadingState.Loading
	const isPublishButtonDisabled = !(front && back)
	
	const createCard = async () => {
		try {
			setPublishLoadingState(LoadingState.Loading)
			
			await Card.create({ deck, section, front, back })
			
			setPublishLoadingState(LoadingState.Success)
			window.close()
		} catch (error) {
			setPublishLoadingState(LoadingState.Fail)
			console.error(error)
			alert(error.message)
		}
	}
	
	return (
		<div className="create-card-pop-up editors">
			<CKEditor
				data={front}
				setData={setFront}
			/>
			<CKEditor
				data={back}
				setData={setBack}
			/>
			<div className="flex">
				<Button
					className={`
						h-12
						mx-auto
						px-8
						text-blue-${isPublishButtonDisabled ? 200 : 400}
						${isPublishButtonDisabled || isPublishButtonLoading ? '' : 'hover:text-white'}
						font-bold
						uppercase
						text-xl
						border-2
						border-blue-${isPublishButtonDisabled ? 200 : 400}
						${isPublishButtonDisabled || isPublishButtonLoading ? '' : 'hover:bg-blue-400'}
						rounded
					`}
					loaderSize="16px"
					loaderThickness="3px"
					loaderColor="#63b3ed"
					loading={isPublishButtonLoading}
					disabled={isPublishButtonDisabled}
					onClick={createCard}
				>
					Create
				</Button>
			</div>
		</div>
	)
}
