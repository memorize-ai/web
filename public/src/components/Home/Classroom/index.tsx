import React from 'react'

import List from './List'

import diagram from '../../../images/home/classroom.png'

import '../../../scss/components/Home/Classroom.scss'

export default () => (
	<div className="classroom">
		<img
			className="diagram"
			src={diagram}
			alt="Classroom diagram"
		/>
		<article className="text">
			<h2 className="title">
				<strong>Teachers and Students</strong><br />
				love memorize.ai
			</h2>
			<p className="how-it-works">
				How it works
			</p>
			<List />
		</article>
	</div>
)
