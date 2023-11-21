import { useRef } from 'react'
import { useUserValue } from './components/UserContext'

import { logout } from './services/loginService'
import Notification from './components/Notification'
import CreateBlogForm from './components/CreateBlogForm'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import BlogList from './components/BlogList'

const App = () => {
  const user = useUserValue()

  const blogFormRef = useRef()

  if (user === null) {
    return (
      <div>
        <Notification />
        <LoginForm />
      </div>
    )
  }

  return (
    <div>
      <Notification />

      <h2>blogs</h2>

      <p>logged in as: {user.username}</p>
      <button onClick={() => logout()}>logout</button>

      <Togglable buttonLabel='create new' ref={blogFormRef}>
        <CreateBlogForm />
      </Togglable>

      <br />
      <BlogList />
    </div>
  )
}

export default App

