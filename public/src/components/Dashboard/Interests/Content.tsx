import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import Topic from '../../../models/Topic'
import useCurrentUser from '../../../hooks/useCurrentUser'
import useTopics from '../../../hooks/useTopics'
import Head, { APP_SCHEMA } from '../../shared/Head'
import { urlForMarket } from '../Market'

import { ReactComponent as CartIcon } from '../../../images/icons/cart.svg'

import '../../../scss/components/Dashboard/Interests.scss'

export default () => {
	const [currentUser] = useCurrentUser()
	const topics = useTopics()
	
	return (
		<>
			<Head
				isPrerenderReady={topics !== null}
				title="Interests | memorize.ai"
				description="Choose your interests so we can show you recommendations."
				breadcrumbs={[
					[
						{
							name: 'Interests',
							url: window.location.href
						}
					]
				]}
				schemaItems={[
					APP_SCHEMA
				]}
			/>
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
			<div className="topics" {...Topic.schemaProps}>
				{topics?.map((topic, i) => (
					<button
						key={topic.id}
						className={cx({
							selected: currentUser?.interestIds?.includes(topic.id) ?? false
						})}
						onClick={() => currentUser?.toggleInterest(topic.id)}
						style={{
							backgroundImage: `url('${topic.imageUrl}')`
						}}
						{...topic.schemaProps}
					>
						<meta {...topic.positionSchemaProps(i)} />
						<meta {...topic.urlSchemaProps} />
						<img {...topic.imageSchemaProps} /* eslint-disable-line */ />
						<div className="check">
							<FontAwesomeIcon icon={faCheck} />
						</div>
						<p {...topic.nameSchemaProps}>{topic.name}</p>
					</button>
				))}
			</div>
		</>
	)
}
