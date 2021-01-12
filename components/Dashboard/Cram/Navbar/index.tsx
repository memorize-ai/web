import { MouseEvent, useCallback } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import styles from './index.module.scss'

const back = (event: MouseEvent<HTMLAnchorElement>) => event.stopPropagation()

export interface CramNavbarProps {
	backUrl: string
	currentIndex: number | null
	count: number | null
	skip(): void
	recap(): void
}

const CramNavbar = ({
	backUrl,
	currentIndex,
	count,
	skip,
	recap
}: CramNavbarProps) => {
	const onSkip = useCallback(
		(event: MouseEvent<HTMLButtonElement>) => {
			event.stopPropagation()
			skip()
		},
		[skip]
	)

	const showRecap = useCallback(
		(event: MouseEvent<HTMLButtonElement>) => {
			event.stopPropagation()
			recap()
		},
		[recap]
	)

	return (
		<div className={styles.root}>
			<Link href={backUrl}>
				<a className={styles.back} onClick={back}>
					<FontAwesomeIcon className={styles.backIcon} icon={faTimes} />
				</a>
			</Link>
			<p className={styles.progress}>
				{currentIndex === null ? '...' : currentIndex + 1} / {count ?? '...'}
			</p>
			<button className={styles.skip} onClick={onSkip}>
				Skip
			</button>
			<button className={styles.recap} onClick={showRecap}>
				Recap
			</button>
		</div>
	)
}

export default CramNavbar
