import React from 'react'

import { ReactComponent as Bullet } from '../../../images/home/bullet.svg'

export const ITEMS = [
	'Create your own decks for your class and allocate a section for each unit',
	'Lock certain sections to restrict access as per class schedule',
	'Share unique unlock keys with your students',
	'Students can then unlock sections and begin memorizing!'
]

export default () => (
	<ol className="list">
		{ITEMS.map((text, i) => (
			<li key={i}>
				<div className="bullet">
					<Bullet />
					<p>{i + 1}</p>
				</div>
				<p>{text}</p>
			</li>
		))}
	</ol>
)
