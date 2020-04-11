import React, { PropsWithChildren, useRef, useEffect, useCallback } from 'react'
import cx from 'classnames'

import '../../scss/components/Dropdown.scss'

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
	const eventListener = useCallback((event: Event) => {
		const { current } = ref
		const { target } = event
		
		if (!current || target === current || current.contains(target as Node | null) || !isShowing)
			return
		
		setIsShowing(false)
	}, [isShowing]) // eslint-disable-line
	
	useEffect(() => {
		document.body[isShowing ? 'addEventListener' : 'removeEventListener'](
			'click',
			eventListener
		)
	}, [isShowing]) // eslint-disable-line
	
	return (
		<div
			className={cx('dropdown', className, { showing: isShowing })}
			ref={newRef => ref.current = newRef}
		>
			<button
				className="trigger"
				onClick={() => setIsShowing(!isShowing)}
			>
				{trigger}
			</button>
			{isShowing && (
				<div
					className={cx('content', {
						[`shadow-${shadow}`]: shadow !== DropdownShadow.None,
						'right-aligned': isRightAligned
					})}
					style={{ top: `calc(100% + ${topMargin})` }}
				>
					{children}
				</div>
			)}
		</div>
	)
}
