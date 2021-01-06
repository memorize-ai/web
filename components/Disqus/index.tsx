import { DISQUS_SHORTNAME } from 'lib/constants'

export interface DisqusProps {
	url: string
	id: string
	title: string
}

export const configFromProps = ({ url, id, title }: DisqusProps) => ({
	url,
	identifier: id,
	title
})

export const componentProps = (props: DisqusProps) => ({
	shortname: DISQUS_SHORTNAME,
	config: configFromProps(props)
})
