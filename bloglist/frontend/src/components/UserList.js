import { useQuery } from '@tanstack/react-query'
import { getUsers } from '../services/userService'

const UserList = () => {
  const result = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    retry: 1,
    refetchOnWindowFocus: false,
  })

  if (result.isPending) {
    return <span>Loading users</span>
  }
  if (result.isError) {
    return <span>user service not available due to server problem</span>
  }

  const users = result.data

  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th>user</th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UserList
