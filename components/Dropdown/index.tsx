import {
	ReactNode,
	SetStateAction,
	useRef,
	useEffect,
	useCallback
} from 'react'
import cx from 'classnames'

import styles from './index.module.scss'

export enum DropdownShadow {
	None = 'none',
	Around = 'around',
	Screen = 'screen'
}

export interface DropdownProps {
	className?: string
	shadow: DropdownShadow
	isRightAligned?: boolean
	trigger: ReactNode
	isShowing: boolean
	setIsShowing(isShowing: SetStateAction<boolean>): void
	children?: ReactNode
}

const Dropdown = ({
	className,
	shadow,
	isRightAligned = true,
	trigger,
	isShowing,
	setIsShowing,
	children
}: DropdownProps) => {
	const ref = useRef(null as HTMLDivElement | null)

	const toggleIsShowing = useCallback(() => {
		setIsShowing(isShowing => !isShowing)
	}, [setIsShowing])

	useEffect(() => {
		const onClick = ({ target }: Event) => {
			const { current } = ref

			if (
				!current ||
				target === current ||
				current.contains(target as Node | null) ||
				!isShowing
			)
				return

			setIsShowing(false)
		}

		const { body } = document

		body.addEventListener('click', onClick)
		return () => body.removeEventListener('click', onClick)
	}, [isShowing, setIsShowing])

	return (
		<div
			ref={ref}
			className={cx(styles.root, className, { [styles.showing]: isShowing })}
			onClick={event => event.stopPropagation()}
		>
			<button
				className={styles.trigger}
				onClick={toggleIsShowing}
				aria-haspopup="menu"
			>
				{trigger}
			</button>
			<div
				className={cx(styles.content, {
					[styles[`shadow_${shadow}`]]: shadow !== DropdownShadow.None,
					[styles.right]: isRightAligned
				})}
				aria-hidden={!isShowing}
			>
				{children}
			</div>
		</div>
	)
}

export default Dropdown
