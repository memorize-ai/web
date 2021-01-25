import { useMemo } from 'react'
import { stripHtml } from 'string-strip-html'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import CKEditor from 'components/CKEditor'

import styles from './index.module.scss'

export interface AddCardsRowProps {
	isStacked: boolean
	uploadUrl: string
	front: string
	back: string
	canRemove: boolean
	remove(): void
	updateFront(front: string): void
	updateBack(back: string): void
}

const AddCardsRow = ({
	isStacked,
	uploadUrl,
	front,
	back,
	canRemove,
	remove,
	updateFront,
	updateBack
}: AddCardsRowProps) => {
	const summary = useMemo(() => stripHtml(front).result || 'New card', [front])

	return (
		<div className={cx(styles.root, { [styles.row]: !isStacked })}>
			<div className={styles.header}>
				<div className={styles.summary}>
					<label className={styles.summaryLabel}>Summary</label>
					<p className={styles.summaryText}>{summary}</p>
				</div>
				<button
					className={styles.remove}
					disabled={!canRemove}
					onClick={remove}
					aria-label="Delete draft"
					data-balloon-pos="left"
				>
					<FontAwesomeIcon icon={faTrash} />
				</button>
			</div>
			<div className={styles.sides}>
				<div className={styles.side}>
					<div className={styles.sideHeader}>
						<FontAwesomeIcon
							className={cx(styles.sideHeaderIcon, {
								[styles.sideHeaderValid]: front
							})}
							icon={front ? faCheck : faTimes}
						/>
						<label className={styles.sideHeaderLabel}>Front</label>
					</div>
					<CKEditor
						className={styles.editor}
						uploadUrl={uploadUrl}
						data={front}
						setData={updateFront}
					/>
				</div>
				<div className={styles.side}>
					<div className={styles.sideHeader}>
						<FontAwesomeIcon
							className={cx(styles.sideHeaderIcon, {
								[styles.sideHeaderValid]: back
							})}
							icon={back ? faCheck : faTimes}
						/>
						<label className={styles.sideHeaderLabel}>Back</label>
					</div>
					<CKEditor
						className={styles.editor}
						uploadUrl={uploadUrl}
						data={back}
						setData={updateBack}
					/>
				</div>
			</div>
		</div>
	)
}

export default AddCardsRow
