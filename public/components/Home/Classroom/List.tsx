import React from 'react'

import Bullet from '../../../images/home/bullet.svg'

export const ITEMS = [
	<>Create your own decks for your class<br />and allocate a section for each unit</>,
	<>Lock certain sections to restrict<br />access as per class schedule</>,
	<>Share unique unlock keys with<br />your students</>,
	<>Students can then unlock sections<br />and begin memorizing!</>
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
