import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Root from './Root'
import Privacy from '../Privacy'
import Support from '../Support'

import Auth from '../Auth'

import Market from '../Dashboard/Market'
import Decks from '../Dashboard/Decks'
import Interests from '../Dashboard/Interests'

import CreateDeck from '../CreateDeck'

import CreateCardPopUp from '../CreateCardPopUp'

import Unsubscribe from '../Unsubscribe'

import CatchAll from '../404'

export default () => (
	<BrowserRouter>
		<Switch>
			<Route exact path="/" component={Root} />
			<Route exact path="/privacy" component={Privacy} />
			<Route exact path="/support" component={Support} />
			
			<Route exact path="/auth" component={Auth} />
			
			<Route exact path="/market" component={Market} />
			<Route
				exact
				path={['/decks', '/decks/:deckId']}
				component={Decks}
			/>
			<Route exact path="/interests" component={Interests} />
			
			<Route exact path="/new" component={CreateDeck} />
			
			<Route
				exact
				path={[
					'/create-card-pop-up',
					'/create-card-pop-up/d/:deckId',
					'/create-card-pop-up/d/:deckId/s/:sectionId'
				]}
				component={CreateCardPopUp}
			/>
			
			<Route exact path="/unsubscribe/:uid/:type" component={Unsubscribe} />
			
			<Route status={404} component={CatchAll} />
		</Switch>
	</BrowserRouter>
)
