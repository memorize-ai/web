import userList from './cache/userList'

const getUsers = (limit = 0) => userList.get(limit)

export default getUsers
