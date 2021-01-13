import { GetStaticProps } from 'next'

import { InterestsProps } from './models'
import getTopics from 'lib/getTopics'

const REVALIDATE = 3600 // 1 hour

export const getStaticProps: GetStaticProps<
	InterestsProps,
	Record<string, never>
> = async () => ({
	props: { topics: await getTopics() },
	revalidate: REVALIDATE
})
