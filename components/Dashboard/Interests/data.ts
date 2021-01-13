import { GetStaticProps } from 'next'

import { InterestsProps } from './models'
import getTopics from 'lib/getTopics'

export const getStaticProps: GetStaticProps<
	InterestsProps,
	Record<string, never>
> = async () => ({
	props: { topics: await getTopics() },
	revalidate: 3600 // 1 hour
})
