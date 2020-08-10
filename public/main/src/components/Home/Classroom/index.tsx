import React from 'react'
import { Link } from 'react-router-dom'

import List from './List'

import { ReactComponent as LeftArrow } from '../../../images/icons/left-arrow.svg'
import diagram from '../../../images/home/classroom.png'

import '../../../scss/components/Home/Classroom.scss'

const HomeClassroom = () => (
	<div id="class" className="classroom">
		<img
			className="diagram"
			src={diagram}
			alt="Classroom diagram"
		/>
		<article className="text">
			<h2
				className="title"
				data-aos="fade-down"
			>
				<strong>Teachers and Students</strong><br />
				love memorize.ai
			</h2>
			<List />
			<Link
				to="/new"
				className="get-started"
			>
				<p>Create your first deck</p>
				<LeftArrow />
			</Link>
		</article>
	</div>
)

export default HomeClassroom
