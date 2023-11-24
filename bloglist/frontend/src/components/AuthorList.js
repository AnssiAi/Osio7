import { Link } from 'react-router-dom'

const AuthorList = ({ authors }) => {
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
          {authors.map((a) => (
            <tr key={a.id}>
              <td>
                <Link to={`/users/${a.id}`}>{a.name}</Link>
              </td>
              <td>{a.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AuthorList
