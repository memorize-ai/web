import React, { memo } from 'react'

import List from './List'

import diagram from '../../../images/home/classroom.png'

import '../../../scss/components/Home/Classroom.scss'

const HomeClassroom = () => (
	<div className="classroom">
		<div className="background" />
		<div className="content">
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
	</div>
)

export default memo(HomeClassroom)
