import React from 'react'
import { useParams } from 'react-router-dom'
import { Heading, Box, Columns, Button } from 'react-bulma-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faLock, faUnlock } from '@fortawesome/free-solid-svg-icons'

import useDeck from '../hooks/useDeck'
import useSection from '../hooks/useSection'

import '../scss/UnlockSection.scss'

export default () => {
	const { deckId, sectionId } = useParams()
	
	const deck = useDeck(deckId ?? '')
	const section = useSection(deckId ?? '', sectionId ?? '')
	
	return (
		<div id="unlock-section">
			<Heading textColor="white">{deck?.name}</Heading>
			<Columns className="is-desktop is-vcentered">
				<Columns.Column size="half" offset="one-quarter">
					<Box id="content-box">
						<Heading>Unlock {section?.name}</Heading>
						<hr />
						<div className="field">
							<p className="control has-icons-left">
								<input className="input" type="email" placeholder="Email" />
								<span className="icon is-small is-left">
									<FontAwesomeIcon icon={faEnvelope} />
								</span>
							</p>
						</div>
						<div className="field">
							<p className="control has-icons-left">
								<input className="input" type="password" placeholder="Password" />
								<span className="icon is-small is-left">
									<FontAwesomeIcon icon={faLock} />
								</span>
							</p>
						</div>
						<Button id="unlock-button" className="is-info" outlined>
							<FontAwesomeIcon icon={faUnlock} />
						</Button>
					</Box>
				</Columns.Column>
			</Columns>
		</div>
	)
}
