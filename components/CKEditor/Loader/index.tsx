import Loader from 'components/Loader'

import styles from './index.module.scss'

const CKEditorLoader = () => (
	<div className={styles.root}>
		<Loader size="24px" thickness="4px" color="#c4c4c4" />
	</div>
)

export default CKEditorLoader
