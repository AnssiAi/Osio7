import { useUserValue, useUserDispatch } from './components/UserContext'
import { logout } from './services/loginService'
import { useQuery } from '@tanstack/react-query'
import { getUsers } from './services/userService'
import { getAll, setToken } from './services/blogService'
import { Routes, Route, useMatch, Link } from 'react-router-dom'
import './style/AppStyle.css'

import Blog from './components/Blog'
import Author from './components/Author'
import AuthorList from './components/AuthorList'
import BlogList from './components/BlogList'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import { useEffect } from 'react'

const App = () => {
  const padding = {
    paddingRight: 5,
  }

  const userDispatch = useUserDispatch()

  useEffect(() => {
    const loggedUser = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUser) {
      const foundUser = JSON.parse(loggedUser)
      userDispatch({ type: 'SET', payload: foundUser })
      setToken(foundUser.token)
    }
  }, [])

  const user = useUserValue()
  const matchAuthor = useMatch('/users/:id')
  const matchBlog = useMatch('/blogs/:id')

  //Queryt App:ssa, jotta Routeille voidaan määrittää oikeat parametrit
  const authorRes = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    retry: 1,
    refetchOnWindowFocus: false,
  })

  const blogRes = useQuery({
    queryKey: ['blogs'],
    queryFn: getAll,
    retry: 1,
    refetchOnWindowFocus: false,
  })

  if (authorRes.isPending || blogRes.isPending) {
    return <span>loading data</span>
  }
  if (authorRes.isError || blogRes.isError) {
    return <span>user service not available due to server problem</span>
  }

  const blogs = blogRes.data
  const authors = authorRes.data

  const author = matchAuthor
    ? authors.find((u) => u.id === matchAuthor.params.id)
    : null
  const blog = matchBlog
    ? blogs.find((b) => b.id === matchBlog.params.id)
    : null

  if (user === null) {
    return (
      <div className='appContainer'>
        <Notification />
        <LoginForm />
      </div>
    )
  }

  return (
    <div className='appContainer'>
      <div className='navbar'>
        <Link style={padding} to='/blogs'>
          blogs
        </Link>
        <Link style={padding} to='/users'>
          users
        </Link>
        <label>logged in as: {user.username}</label>
        <button onClick={() => logout()}>logout</button>
      </div>

      <Notification />

      <div className='appContent'>
        <Routes>
          <Route path='/users' element={<AuthorList authors={authors} />} />
          <Route path='/users/:id' element={<Author author={author} />} />
          <Route path='/blogs/:id' element={<Blog blog={blog} />} />
          <Route path='/blogs' element={<BlogList blogs={blogs} />} />
          <Route path='/' element={<BlogList blogs={blogs} />} />
        </Routes>
      </div>
    </div>
  )
}

export default App

