import styles from './index.module.scss'

export interface NotificationProps {
	title: string
	body: string
}

const Notification = ({ title, body }: NotificationProps) => (
	<>
		<p className={styles.title}>{title}</p>
		<p className={styles.body}>{body}</p>
	</>
)

export default Notification
