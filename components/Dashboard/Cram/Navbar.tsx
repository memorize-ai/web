import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

const CramNavbar = ({
	backUrl,
	currentIndex,
	count,
	skip,
	recap
}: {
	backUrl: string
	currentIndex: number | null
	count: number | null
	skip: () => void
	recap: () => void
}) => (
	<div className="cram-navbar">
		<Link href={backUrl}>
			<a className="back" onClick={event => event.stopPropagation()}>
				<FontAwesomeIcon icon={faTimes} />
			</a>
		</Link>
		<p className="progress">
			{currentIndex === null ? '...' : currentIndex + 1} / {count ?? '...'}
		</p>
		<button
			className="skip"
			onClick={event => {
				event.stopPropagation()
				skip()
			}}
		>
			Skip
		</button>
		<button
			className="recap"
			onClick={event => {
				event.stopPropagation()
				recap()
			}}
		>
			Recap
		</button>
	</div>
)

export default CramNavbar
