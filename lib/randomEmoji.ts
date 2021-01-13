import sample from 'lodash/sample'

import { EMOJIS } from './constants'

const randomEmoji = () => sample(EMOJIS) ?? EMOJIS[0]

export default randomEmoji
