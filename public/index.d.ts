declare module '@elastic/app-search-javascript'
declare module '@ckeditor/ckeditor5-react'
declare module 'ckeditor5-memorize.ai'

declare module '*.svg' {
	const content: React.FC<React.SVGAttributes<SVGElement>>
	export = content
}

declare module '*.webp' {
	const content: string
	export = content
}

declare module '*.png' {
	const content: string
	export = content
}

declare module '*.jpg' {
	const content: string
	export = content
}

declare module '*.gif' {
	const content: string
	export = content
}
