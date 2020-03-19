import React, { useState } from 'react'
import CKEditor from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

import Deck from '../../models/Deck'
import Section from '../../models/Section'

import '../../types/ckeditor5-react.d'
import '../../types/ckeditor5-build-classic.d'

export default (
	{ deck, section, text }: {
		deck: Deck
		section: Section
		text: string
	}
) => {
	const [front, setFront] = useState(text)
	const [back, setBack] = useState('')
	
	return (
		<div className="create-card-pop-up editors">
			<CKEditor
				editor={ClassicEditor}
				data={front}
				onChange={(_event: any, editor: any) =>
					setFront(editor.getData())
				}
			/>
			<CKEditor
				editor={ClassicEditor}
				data={back}
				onChange={(_event: any, editor: any) =>
					setBack(editor.getData())
				}
			/>
		</div>
	)
}
