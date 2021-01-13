import Link from 'next/link'
import Img, { Svg } from 'react-optimized-image'

import List from './List'

import leftArrow from 'images/icons/left-arrow.svg'
import diagram from 'images/home/classroom.png'
import styles from './index.module.scss'

const HomeClassroom = () => (
	<div id="class" className={styles.root}>
		<Img
			className={styles.diagram}
			src={diagram}
			alt="Classroom diagram"
			webp
		/>
		<article className={styles.article}>
			<h2 className={styles.title} data-aos="fade-down">
				<strong>Teachers and Students</strong>
				<br />
				love memorize.ai
			</h2>
			<List />
			<Link href="/new">
				<a className={styles.new}>
					<span className={styles.newText}>Create your first deck</span>
					<Svg className={styles.newIcon} src={leftArrow} />
				</a>
			</Link>
		</article>
	</div>
)

export default HomeClassroom
