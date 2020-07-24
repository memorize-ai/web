import React from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import Root from './Root'
import Home from '../Home'

import Privacy from '../Privacy'
import Support from '../Support'

import CreateDeck from '../Dashboard/CreateDeck'
import EditDeck from '../Dashboard/EditDeck'

import AddCards from '../Dashboard/AddCards'
import EditCard from '../Dashboard/EditCard'

import Review from '../Dashboard/Review'
import Cram from '../Dashboard/Cram'

import Market from '../Dashboard/Market'
import Decks from '../Dashboard/Decks'
import Interests from '../Dashboard/Interests'

import DeckPage from '../Dashboard/DeckPage'

import Unsubscribe from '../Unsubscribe'
import BlockUser from '../BlockUser'
import ReportMessage from '../ReportMessage'
import RestrictContact from '../RestrictContact'

import CatchAll from '../404'

import AuthModal from '../shared/Modal/Auth'

import 'react-toastify/dist/ReactToastify.css'

const App = () => (
	<BrowserRouter>
		<Switch>
			<Route exact path="/" component={Root} />
			<Route exact path="/landing" component={Home} />
			
			<Route exact path="/privacy" component={Privacy} />
			<Route exact path="/support" component={Support} />
			
			<Route exact path="/new" component={CreateDeck} />
			<Route exact path="/edit/:slugId/:slug" component={EditDeck} />
			
			<Route
				exact
				path={[
					'/decks/:slugId/:slug/add',
					'/decks/:slugId/:slug/add/:sectionId'
				]}
				component={AddCards}
			/>
			<Route exact path="/decks/:slugId/:slug/edit/:cardId" component={EditCard} />
			
			<Route
				exact
				path={[
					'/review',
					'/review/:slugId/:slug',
					'/review/:slugId/:slug/:sectionId'
				]}
				component={Review}
			/>
			<Route
				exact
				path={[
					'/cram/:slugId/:slug',
					'/cram/:slugId/:slug/:sectionId'
				]}
				component={Cram}
			/>
			
			<Redirect exact path="/d" to="/market" />
			<Route exact path="/market" component={Market} />
			<Route
				exact
				path={[
					'/decks',
					'/decks/:slugId/:slug',
					'/d/:slugId/:slug/u/:unlockSectionId'
				]}
				component={Decks}
			/>
			<Route exact path="/interests" component={Interests} />
			
			<Route exact path="/d/:slugId/:slug" component={DeckPage} />
			
			<Route exact path="/unsubscribe/:uid/:type" component={Unsubscribe} />
			<Route exact path="/block/:to/:from" component={BlockUser} />
			<Route exact path="/report/:uid/message/:messageId" component={ReportMessage} />
			<Route exact path="/restrict-contact/:uid" component={RestrictContact} />
			
			<Route status={404} component={CatchAll} />
		</Switch>
		<AuthModal />
		<ToastContainer />
	</BrowserRouter>
)

export default App
