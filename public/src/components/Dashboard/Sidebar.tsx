import React, { useState } from 'react'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

import useDecks from '../../hooks/useDecks'
import useCurrentUser from '../../hooks/useCurrentUser'
import Logo, { LogoType } from '../shared/Logo'
import Input from '../shared/Input'
import Section from './SidebarSection'
import { isNullish, formatNumber, formatNumberAsInt } from '../../utils'

import '../../scss/components/Dashboard/Sidebar.scss'

export default () => {
	const decks = useDecks()
	const [currentUser] = useCurrentUser()
	
	const [query, setQuery] = useState('')
	
	const isLevelLoading = isNullish(currentUser?.level)
	
	const level = isLevelLoading ? '...' : formatNumberAsInt(currentUser!.level!)
	const nextLevel = isLevelLoading ? '...' : formatNumberAsInt(currentUser!.level! + 1)
	const xp = isNullish(currentUser?.xp) ? '...' : formatNumber(currentUser!.xp)
	
	return (
		<div className="sidebar">
			<div className="top">
				<Logo type={LogoType.Capital} />
				<div className="divider" />
				<Input
					icon={faSearch}
					type="name"
					placeholder="Decks"
					value={query}
					setValue={setQuery}
				/>
			</div>
			<div className="sections">
				<Section
					title="Due"
					decks={decks.filter(deck => deck.userData?.isDue ?? false)}
					query={query}
					includesDivider
				/>
				<Section
					title="Favorites"
					decks={decks.filter(deck => deck.userData?.isFavorite ?? false)}
					query={query}
					includesDivider
				/>
				<Section title="All" decks={decks} query={query} />
			</div>
			<div className="bottom">
				<div className="divider" />
				<div className="content">
					<p className="stats">
						<span className="level">lvl {level}</span>&nbsp;
						<span className="bullet">&bull;</span>&nbsp;
						<span className="xp">{xp} xp</span>
					</p>
					<div className="level-container">
						<div className="slider">
							<div style={{ width: `${(currentUser?.percentToNextLevel ?? 0) * 100}%` }}/>
						</div>
						<p className="level">lvl {nextLevel}</p>
					</div>
				</div>
			</div>
		</div>
	)
}
