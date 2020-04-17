import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import Deck from '../../../models/Deck'
import useImageUrl from '../../../hooks/useImageUrl'
import CreateSectionModal from './CreateSectionModal'

import { ReactComponent as ShareIcon } from '../../../images/icons/share.svg'
import Dropdown, { DropdownShadow } from '../../shared/Dropdown'

export default ({ deck }: { deck: Deck | null }) => {
	const [imageUrl] = useImageUrl(deck)
	
	const [isCreateSectionModalShowing, setIsCreateSectionModalShowing] = useState(false)
	const [isShareModalShowing, setIsShareModalShowing] = useState(false)
	const [isOptionsDropdownShowing, setIsOptionsDropdownShowing] = useState(false)
	
	return (
		<div className={cx('header', { loading: !deck })}>
			<img src={imageUrl ?? Deck.DEFAULT_IMAGE_URL} alt="Deck" />
			<h1 className="name">
				{deck?.name}
			</h1>
			<button className="create-section" onClick={() => setIsCreateSectionModalShowing(true)}>
				Create section
			</button>
			<button className="share" onClick={() => setIsShareModalShowing(true)}>
				<ShareIcon />
			</button>
			<Dropdown
				className="options"
				shadow={DropdownShadow.Screen}
				trigger={<FontAwesomeIcon icon={faBars} />}
				isShowing={isOptionsDropdownShowing}
				setIsShowing={setIsOptionsDropdownShowing}
			>
				Options
			</Dropdown>
			{deck && (
				<CreateSectionModal
					deck={deck}
					isShowing={isCreateSectionModalShowing}
					setIsShowing={setIsCreateSectionModalShowing}
				/>
			)}
		</div>
	)
}
