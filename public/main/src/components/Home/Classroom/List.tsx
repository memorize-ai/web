import React, { ReactNode, memo } from 'react'

import { ReactComponent as Bullet } from '../../../images/home/bullet.svg'

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
		lines: 2,
		text: <>Students can use memorize.ai on their<br />computers and Apple devices</>
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
					<Bullet />
					<p>{i + 1}</p>
				</div>
				<p>{text}</p>
			</li>
		))}
	</ol>
)

export default memo(HomeClassroomList)
