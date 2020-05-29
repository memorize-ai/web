declare module '@elastic/app-search-javascript'

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
