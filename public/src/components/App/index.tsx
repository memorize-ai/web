import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Home from '../Home'
import Privacy from '../Privacy'
import Support from '../Support'

import GetDeck from '../GetDeck'
import UnlockSection from '../UnlockSection'

import CreateCardPopUp from '../CreateCardPopUp'
import CreateCardPopUpSections from '../CreateCardPopUp/Sections'
import CreateCardPopUpEditor from '../CreateCardPopUp/Editor'

import CatchAll from '../404'

export default () => (
	<BrowserRouter>
		<Switch>
			<Route exact path="/" component={Home} />
			<Route exact path="/privacy" component={Privacy} />
			<Route exact path="/support" component={Support} />
			
			<Route exact path="/d/:deckId/g" component={GetDeck} />
			<Route exact path="/d/:deckId/s/:sectionId/u" component={UnlockSection} />
			
			<Route exact path="/create-card-pop-up" component={CreateCardPopUp} />
			<Route exact path="/create-card-pop-up/d/:deckId" component={CreateCardPopUpSections} />
			<Route exact path="/create-card-pop-up/d/:deckId/s/:sectionId" component={CreateCardPopUpEditor} />
			
			<Route exact component={CatchAll} />
		</Switch>
	</BrowserRouter>
)
