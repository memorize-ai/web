import { readdirSync } from 'fs'
import { join } from 'path'

import Post from 'models/Post'

const POSTS = join(process.cwd(), 'posts')

export default () =>
	readdirSync(POSTS).map(path => ({
		slug: path.replace(/\.mdx$/, ''),
		...require(`../posts/${path}`).meta
	} as Post))
