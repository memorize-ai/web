import React, { useMemo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import Card from 'models/Card'
import CKEditor from './CKEditor'

const AddCardRow = ({
	uploadUrl,
	front,
	back,
	canRemove,
	remove,
	updateFront,
	updateBack
}: {
	uploadUrl: string
	front: string
	back: string
	canRemove: boolean
	remove: () => void
	updateFront: (front: string) => void
	updateBack: (back: string) => void
}) => {
	const summary = useMemo(() => Card.getSummary(front) || 'New card', [front])

	return (
		<div className="card">
			<div className="header">
				<div className="summary">
					<label>Summary</label>
					<p>{summary}</p>
				</div>
				<button
					className="remove"
					disabled={!canRemove}
					onClick={remove}
					aria-label="Delete draft"
					data-balloon-pos="left"
				>
					<FontAwesomeIcon icon={faTrash} />
				</button>
			</div>
			<div className="sides">
				<div>
					<div className="header">
						<FontAwesomeIcon
							className={cx({ valid: front })}
							icon={front ? faCheck : faTimes}
						/>
						<label>Front</label>
					</div>
					<CKEditor uploadUrl={uploadUrl} data={front} setData={updateFront} />
				</div>
				<div>
					<div className="header">
						<FontAwesomeIcon
							className={cx({ valid: back })}
							icon={back ? faCheck : faTimes}
						/>
						<label>Back</label>
					</div>
					<CKEditor uploadUrl={uploadUrl} data={back} setData={updateBack} />
				</div>
			</div>
		</div>
	)
}

export default AddCardRow
