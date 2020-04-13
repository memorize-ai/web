import React from 'react'
import ReactDOM from 'react-dom'
import Modal from 'react-modal'
import AOS from 'aos'

import * as serviceWorker from './serviceWorker'
import { CurrentUserProvider } from './contexts/CurrentUser'
import { DecksProvider } from './contexts/Decks'
import { SectionsProvider } from './contexts/Sections'
import { CardsProvider } from './contexts/Cards'
import { DeckImageUrlsProvider } from './contexts/DeckImageUrls'
import { SimilarDecksProvider } from './contexts/SimilarDecks'
import { TopicsProvider } from './contexts/Topics'
import { CreateDeckProvider } from './contexts/CreateDeck'
import { ExpandedSectionsProvider } from './contexts/ExpandedSections'
import { CountersProvider } from './contexts/Counters'
import { SearchProvider } from './contexts/Search'
import { AuthModalProvider } from './contexts/AuthModal'
import App from './components/App'
import firebase from './firebase'

import 'firebase/analytics'

import './scss/index.scss'

const analytics = firebase.analytics()
const root = document.getElementById('root') ?? document.body

analytics.logEvent('start')
AOS.init()

Modal.setAppElement(root)

ReactDOM.render((
	<CurrentUserProvider>
		<DecksProvider>
			<SectionsProvider>
				<CardsProvider>
					<DeckImageUrlsProvider>
						<SimilarDecksProvider>
							<TopicsProvider>
								<CreateDeckProvider>
									<ExpandedSectionsProvider>
										<CountersProvider>
											<SearchProvider>
												<AuthModalProvider>
													<App />
												</AuthModalProvider>
											</SearchProvider>
										</CountersProvider>
									</ExpandedSectionsProvider>
								</CreateDeckProvider>
							</TopicsProvider>
						</SimilarDecksProvider>
					</DeckImageUrlsProvider>
				</CardsProvider>
			</SectionsProvider>
		</DecksProvider>
	</CurrentUserProvider>
), root)

serviceWorker.register()
