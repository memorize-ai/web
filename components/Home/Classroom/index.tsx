import Link from 'next/link'
import Img, { Svg } from 'react-optimized-image'

import List from './List'

import leftArrow from 'images/icons/left-arrow.svg'
import diagram from 'images/home/classroom.png'

const HomeClassroom = () => (
	<div id="class" className="classroom">
		<Img className="diagram" src={diagram} alt="Classroom diagram" webp />
		<article className="text">
			<h2 className="title" data-aos="fade-down">
				<strong>Teachers and Students</strong>
				<br />
				love memorize.ai
			</h2>
			<List />
			<Link href="/new">
				<a className="get-started">
					<span className="text">Create your first deck</span>
					<Svg src={leftArrow} />
				</a>
			</Link>
		</article>
	</div>
)

export default HomeClassroom
