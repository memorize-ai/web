import { useMemo } from 'react'
import { NextPage, GetStaticProps } from 'next'
import Link from 'next/link'
import { Svg } from 'react-optimized-image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import Topic, { TopicData } from 'models/Topic'
import useCurrentUser from 'hooks/useCurrentUser'
import useUrlForMarket from 'hooks/useUrlForMarket'
import getTopics from 'lib/getTopics'
import Dashboard, {
	DashboardNavbarSelection as Selection
} from 'components/Dashboard'
import Head, { APP_SCHEMA } from 'components/Head'

import cart from 'images/icons/cart.svg'

interface InterestsProps {
	topics: TopicData[]
}

const Interests: NextPage<InterestsProps> = ({ topics: topicsData }) => {
	const topics = useMemo(() => topicsData.map(data => new Topic(data)), [
		topicsData
	])

	const [currentUser] = useCurrentUser()
	const marketUrl = useUrlForMarket()

	return (
		<Dashboard selection={Selection.Interests} className="interests">
			<Head
				title="Interests | memorize.ai"
				description="Choose your interests so we can show you recommendations."
				breadcrumbs={url => [[{ name: 'Interests', url }]]}
				schema={[APP_SCHEMA]}
			/>
			<div className="header">
				<div className="left">
					<h1 className="title">Choose your interests</h1>
					<h3 className="subtitle">
						Your interests help us show you recommendations
					</h3>
				</div>
				<Link href={marketUrl}>
					<a className="market-link">
						<Svg src={cart} />
						<p>Your recommendations</p>
					</a>
				</Link>
			</div>
			<div className="topics" {...Topic.schemaProps}>
				{topics.map((topic, i) => (
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
						<img {...topic.imageSchemaProps} />
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

export const getStaticProps: GetStaticProps<
	InterestsProps,
	Record<string, never>
> = async () => ({
	props: { topics: await getTopics() },
	revalidate: 3600 // 1 hour
})

export default Interests
