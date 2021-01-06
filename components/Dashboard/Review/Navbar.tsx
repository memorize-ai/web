import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

const ReviewNavbar = (
	{ backUrl, currentIndex, count, recap }: {
		backUrl: string
		currentIndex: number | null
		count: number | null
		recap: () => void
	}
) => (
	<div className="review-navbar">
		<Link href={backUrl}>
			<a
				className="back"
				onClick={event => event.stopPropagation()}
			>
				<FontAwesomeIcon icon={faTimes} />
			</a>
		</Link>
		<p className="progress">
			{currentIndex === null
				? '...'
				: currentIndex + 1
			} / {count ?? '...'}
		</p>
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

export default ReviewNavbar
