import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import Dashboard, { DashboardNavbarSelection as Selection } from 'components/Dashboard'
import Topic from 'models/Topic'
import useCurrentUser from 'hooks/useCurrentUser'
import useTopics from 'hooks/useTopics'
import Head, { APP_SCHEMA } from 'components/shared/Head'
import { urlForMarket } from 'lib/utils'

import CartIcon from '../images/icons/cart.svg'

import styles from 'styles/components/Dashboard/Interests.module.scss'

export default () => {
	const router = useRouter()
	
	const [currentUser] = useCurrentUser()
	const topics = useTopics()
	
	return (
		<Dashboard selection={Selection.Interests} className="interests">
			<Head
				isPrerenderReady={topics !== null}
				title="Interests | memorize.ai"
				description="Choose your interests so we can show you recommendations."
				breadcrumbs={[
					[
						{
							name: 'Interests',
							url: `https://memorize.ai${router.asPath}`
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
				<Link href="/market" as={urlForMarket()}>
					<a className="market-link">
						<CartIcon />
						<p>Your recommendations</p>
					</a>
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
		</Dashboard>
	)
}
