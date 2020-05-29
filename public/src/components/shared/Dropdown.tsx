import React, { PropsWithChildren, useRef, useEffect } from 'react'
import cx from 'classnames'

import styles from '../../styles/components/Dropdown.module.scss'

export enum DropdownShadow {
	None = 'none',
	Around = 'around',
	Screen = 'screen'
}

export default (
	{
		className,
		shadow,
		isRightAligned = true,
		topMargin = '8px',
		trigger,
		isShowing,
		setIsShowing,
		children
	}: PropsWithChildren<{
		className?: string
		shadow: DropdownShadow
		isRightAligned?: boolean
		topMargin?: string
		trigger: JSX.Element
		isShowing: boolean
		setIsShowing: (isShowing: boolean) => void
	}>
) => {
	const ref = useRef(null as HTMLDivElement | null)
	
	useEffect(() => {
		const onClick = ({ target }: Event) => {
			const { current } = ref
			
			if (!current || target === current || current.contains(target as Node | null) || !isShowing)
				return
			
			setIsShowing(false)
		}
		
		const { body } = document
		
		body.addEventListener('click', onClick)
		
		return () => body.removeEventListener('click', onClick)
	}, [isShowing]) // eslint-disable-line
	
	return (
		<div
			ref={ref}
			className={cx(styles.root, className)}
			onClick={event => event.stopPropagation()}
		>
			<button
				className={cx(styles.trigger, {
					[styles.showing]: isShowing
				})}
				onClick={() => setIsShowing(!isShowing)}
			>
				{trigger}
			</button>
			{isShowing && (
				<div
					className={cx(styles.content, {
						[styles[shadow]]: shadow !== DropdownShadow.None,
						[styles.rightAligned]: isRightAligned
					})}
					style={{ top: `calc(100% + ${topMargin})` }}
				>
					{children}
				</div>
			)}
		</div>
	)
}
