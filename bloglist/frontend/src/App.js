import { useState, useEffect, useRef } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getAll,
  createNew,
  setToken,
  update,
  removeBlog,
} from './services/blogs'
import { useNotificationDispatch } from './components/NotificationContext'

import Blog from './components/Blog'
import loginService from './services/login'
import Notification from './components/Notification'
import CreateBlogForm from './components/CreateBlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const queryClient = useQueryClient()
  const dispatch = useNotificationDispatch()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      setToken(user.token)
    }
  }, [])

  const blogFormRef = useRef()

  //Haetaan blogit palvelimelta
  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: getAll,
    retry: 1,
    refetchOnWindowFocus: false,
  })
  //Viestit odottaessa ja virheen tapahtuessa
  if (result.isPending) {
    return <span>Loading data</span>
  }
  if (result.isError) {
    return <span>blog service not available due to server problem</span>
  }
  //Haetut blogit
  const blogs = result.data

  //Notifikaatioiden dispatch keskitetty tähän funktioon
  const sendDispatch = (message) => {
    dispatch({ type: 'SHOW', payload: message })
    setTimeout(() => {
      dispatch({ type: 'CLEAR' })
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user))
      setToken(user.token)

      setUser(user)
      setUsername('')
      setPassword('')

      sendDispatch(`logged in as ${user.username}`)
    } catch (exception) {
      sendDispatch('wrong username or password')
    }
  }

  const handleLogout = (event) => {
    window.localStorage.removeItem('loggedNoteappUser')
    window.location.reload()
  }

  /*
  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    createNew(blogObject)
      .then(() => {
        getAll().then((foundblogs) => {
          setBlogs(sortBlogArray(foundblogs))
        })
        sendDispatch(
          `new blog ${blogObject.title} by ${blogObject.author} created`
        )
      })
      .catch((error) => {
        sendDispatch('failed to create a new blog')
      })
    //Tyhjennä form
    document.getElementById('blog_form').reset()
  }
  */

  /*
  const updLikes = (event, object) => {
    event.preventDefault()

    const newBlog = {
      ...object,
      likes: object.likes + 1,
    }

    const id = newBlog.id

    update(id, newBlog).then(() => {
      getAll().then((foundblogs) => {
        setBlogs(sortBlogArray(foundblogs))
      })
    })
  }

  const delBlog = (event, id) => {
    event.preventDefault()

    if (window.confirm('Remove this blog?')) {
      removeBlog(id).then((response) => {
        console.log(response)

        blogService.getAll().then((foundblogs) => {
          setBlogs(sortBlogArray(foundblogs))
        })
      })
      sendDispatch('Blog removed')
    }
  }
  */

  if (user === null) {
    return (
      <div>
        <Notification />

        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              id='username'
              type='text'
              value={username}
              name='Username'
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              id='password'
              type='password'
              value={password}
              name='Password'
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button id='login-btn' type='submit'>
            login
          </button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <Notification />

      <h2>blogs</h2>

      <p>logged in as: {user.username}</p>
      <button onClick={() => handleLogout()}>logout</button>

      <Togglable buttonLabel='create new' ref={blogFormRef}>
        <CreateBlogForm />
      </Togglable>

      <br />

      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          //updLikes={updLikes}
          //delBlog={delBlog}
          user={user.username}
        />
      ))}
    </div>
  )
}

export default App

