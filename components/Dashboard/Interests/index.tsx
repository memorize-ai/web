import { useMemo } from 'react'
import { NextPage } from 'next'
import Link from 'next/link'
import { Svg } from 'react-optimized-image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import { InterestsProps } from './models'
import Topic from 'models/Topic'
import useCurrentUser from 'hooks/useCurrentUser'
import useUrlForMarket from 'hooks/useUrlForMarket'
import Dashboard, {
	DashboardNavbarSelection as Selection
} from 'components/Dashboard'
import Head, { APP_SCHEMA } from 'components/Head'

import cart from 'images/icons/cart.svg'
import styles from './index.module.scss'

const Interests: NextPage<InterestsProps> = ({ topics: topicsData }) => {
	const topics = useMemo(() => topicsData.map(data => new Topic(data)), [
		topicsData
	])

	const [currentUser] = useCurrentUser()
	const marketUrl = useUrlForMarket()

	return (
		<Dashboard
			className={styles.root}
			contentClassName={styles.content}
			sidebarClassName={styles.sidebar}
			selection={Selection.Interests}
		>
			<Head
				title="Interests | memorize.ai"
				description="Choose your interests so we can show you recommendations."
				breadcrumbs={url => [[{ name: 'Interests', url }]]}
				schema={[APP_SCHEMA]}
			/>
			<header className={styles.header}>
				<article>
					<h1 className={styles.title}>Choose your interests</h1>
					<h3 className={styles.subtitle}>
						Your interests help us show you recommendations
					</h3>
				</article>
				<Link href={marketUrl}>
					<a className={styles.market}>
						<Svg className={styles.marketIcon} src={cart} />
						<p className={styles.marketText}>Your recommendations</p>
					</a>
				</Link>
			</header>
			<div className={styles.topics} {...Topic.schemaProps}>
				{topics.map((topic, i) => (
					<button
						key={topic.id}
						className={cx(styles.topic, {
							[styles.selectedTopic]:
								currentUser?.interestIds?.includes(topic.id) ?? false
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
						<div className={styles.topicCheck}>
							<FontAwesomeIcon
								className={styles.topicCheckIcon}
								icon={faCheck}
							/>
						</div>
						<p className={styles.topicName} {...topic.nameSchemaProps}>
							{topic.name}
						</p>
					</button>
				))}
			</div>
		</Dashboard>
	)
}

export default Interests
