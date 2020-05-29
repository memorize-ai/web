import { PropsWithChildren } from 'react'

import { CurrentUserProvider } from './CurrentUser'
import { DecksProvider } from './Decks'
import { SectionsProvider } from './Sections'
import { CardsProvider } from './Cards'
import { DeckImageUrlsProvider } from './DeckImageUrls'
import { SimilarDecksProvider } from './SimilarDecks'
import { TopicsProvider } from './Topics'
import { CreateDeckProvider } from './CreateDeck'
import { ExpandedSectionsProvider } from './ExpandedSections'
import { CountersProvider } from './Counters'
import { SearchProvider } from './Search'
import { AuthModalProvider } from './AuthModal'
import { CreatorsProvider } from './Creators'
import { AddCardsProvider } from './AddCards'

export default ({ children }: PropsWithChildren<{}>) => (
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
													<CreatorsProvider>
														<AddCardsProvider>
															{children}
														</AddCardsProvider>
													</CreatorsProvider>
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
)
