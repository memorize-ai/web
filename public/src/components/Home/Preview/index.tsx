import React, { memo } from 'react'
import cx from 'classnames'

import usePreview from './usePreview'

import '../../../scss/components/Home/Preview.scss'

const Preview = () => {
	const { cards } = usePreview()
	
	return (
		<div className="preview">
			<div className="background" />
			<div className="content">
				<div className="card-container">
					<div className="location">
						
					</div>
					<div className="cards">
						<div className="card foreground">
							hi
						</div>
						{/* <div className="card foreground-2">
							
						</div> */}
						<div className={cx(
							'card',
							'background-1',
							{ hidden: cards.length < 2 }
						)} />
						<div className={cx(
							'card',
							'background-2',
							{ hidden: cards.length < 3 }
						)} />
					</div>
				</div>
				<div className="footer">
					
				</div>
			</div>
		</div>
	)
}

export default memo(Preview)
