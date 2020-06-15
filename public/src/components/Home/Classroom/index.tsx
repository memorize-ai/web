import React, { memo } from 'react'

import List from './List'
import AuthButton from '../../shared/AuthButton'

import { ReactComponent as LeftArrow } from '../../../images/icons/left-arrow.svg'
import diagram from '../../../images/home/classroom.png'

import '../../../scss/components/Home/Classroom.scss'

const HomeClassroom = () => (
	<div id="class" className="classroom">
		<div className="background" />
		<div className="content">
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
				<AuthButton className="get-started">
					<p>Get started</p>
					<LeftArrow />
				</AuthButton>
			</article>
		</div>
	</div>
)

export default memo(HomeClassroom)
