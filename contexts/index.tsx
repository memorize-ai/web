import { ReactNode } from 'react'

import { CurrentUserProvider } from './CurrentUser'
import { DecksProvider } from './Decks'
import { SectionsProvider } from './Sections'
import { CardsProvider } from './Cards'
import { SimilarDecksProvider } from './SimilarDecks'
import { CreateDeckProvider } from './CreateDeck'
import { ExpandedSectionsProvider } from './ExpandedSections'
import { CountersProvider } from './Counters'
import { SearchProvider } from './Search'
import { AuthModalProvider } from './AuthModal'
import { CreatorsProvider } from './Creators'
import { AddCardsProvider } from './AddCards'
import { ContactUserLoadingStateProvider } from './ContactUserLoadingState'
import { ActivityProvider } from './Activity'

export interface ProviderProps {
	children?: ReactNode
}

const Provider = ({ children }: ProviderProps) => (
	<CurrentUserProvider>
		<DecksProvider>
			<SectionsProvider>
				<CardsProvider>
					<SimilarDecksProvider>
						<CreateDeckProvider>
							<ExpandedSectionsProvider>
								<CountersProvider>
									<SearchProvider>
										<AuthModalProvider>
											<CreatorsProvider>
												<AddCardsProvider>
													<ContactUserLoadingStateProvider>
														<ActivityProvider>{children}</ActivityProvider>
													</ContactUserLoadingStateProvider>
												</AddCardsProvider>
											</CreatorsProvider>
										</AuthModalProvider>
									</SearchProvider>
								</CountersProvider>
							</ExpandedSectionsProvider>
						</CreateDeckProvider>
					</SimilarDecksProvider>
				</CardsProvider>
			</SectionsProvider>
		</DecksProvider>
	</CurrentUserProvider>
)

export default Provider
