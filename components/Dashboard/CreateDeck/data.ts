import { GetStaticProps } from 'next'

import { CreateDeckProps } from './models'
import getTopics from 'lib/getTopics'

export const getStaticProps: GetStaticProps<
	CreateDeckProps,
	Record<string, never>
> = async () => ({
	props: { topics: await getTopics() },
	revalidate: 3600 // 1 hour
})
