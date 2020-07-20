import { readdir } from 'fs/promises'
import { join } from 'path'

import Post from 'models/Post'

const POSTS = join(process.cwd(), 'posts')

export default async () => {
	const files = await readdir(POSTS)
	
	return files.map(path => ({
		slug: path.replace(/\.mdx$/, ''),
		...require(`../posts/${path}`).meta
	} as Post))
}
