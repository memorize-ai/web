import { ReactNode } from 'react'
import { Svg } from 'react-optimized-image'

import bullet from 'images/home/bullet.svg'

export interface ListItem {
	lines: number
	text: ReactNode
}

const ITEMS: ListItem[] = [
	{
		lines: 2,
		text: <>Create cards and split them into sections<br />for your class</>
	},
	{
		lines: 2,
		text: <><em>Optionally</em> lock sections according to class<br />schedule</>
	},
	{
		lines: 1,
		text: 'Share keys with students to unlock sections'
	},
	{
		lines: 1,
		text: 'Students can use memorize.ai anywhere!'
	}
]

const HomeClassroomList = () => (
	<ol className="list">
		{ITEMS.map(({ lines, text }, i) => (
			<li
				key={i}
				data-aos="fade-down"
				data-aos-delay={i * 100}
			>
				<div className={`bullet lines-${lines}`}>
					<Svg src={bullet} />
					<p>{i + 1}</p>
				</div>
				<p>{text}</p>
			</li>
		))}
	</ol>
)

export default HomeClassroomList
