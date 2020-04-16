import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import Dashboard, { DashboardNavbarSelection as Selection } from '..'
import useCurrentUser from '../../../hooks/useCurrentUser'
import useTopics from '../../../hooks/useTopics'
import { urlForMarket } from '../Market'

import { ReactComponent as CartIcon } from '../../../images/icons/cart.svg'

import '../../../scss/components/Dashboard/Interests.scss'

export default () => {
	const [currentUser] = useCurrentUser()
	
	return (
		<Dashboard selection={Selection.Interests} className="interests" gradientHeight="500px">
			<div className="header">
				<div className="left">
					<h1 className="title">
						Choose your interests
					</h1>
					<h3 className="subtitle">
						Your interests help us show you recommendations
					</h3>
				</div>
				<Link to={urlForMarket()} className="market-link">
					<CartIcon />
					<p>Your recommendations</p>
				</Link>
			</div>
			<div className="topics">
				{useTopics().map(topic => (
					<button
						key={topic.id}
						className={cx({
							selected: currentUser?.interestIds?.includes(topic.id) ?? false
						})}
						onClick={() => currentUser?.toggleInterest(topic.id)}
						style={{
							backgroundImage: `url('${topic.imageUrl}')`
						}}
					>
						<div className="check">
							<FontAwesomeIcon icon={faCheck} />
						</div>
						<p>{topic.name}</p>
					</button>
				))}
			</div>
		</Dashboard>
	)
}
