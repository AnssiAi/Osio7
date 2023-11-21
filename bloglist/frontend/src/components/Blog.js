import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotificationDispatch } from './NotificationContext'
import { updateBlog, removeBlog } from '../services/blogs'

const Blog = ({ blog, user }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const [visible, setVisible] = useState(false)
  const [authorized, setAuthorized] = useState(false)

  const queryClient = useQueryClient()
  const dispatch = useNotificationDispatch()

  const showWhenVisible = { display: visible ? '' : 'none' }
  const showWhenAuthorized = { display: authorized ? '' : 'none' }

  const handleVisibleChange = (event) => {
    setVisible(!visible)

    if (user === blog.user.username) {
      setAuthorized(true)
    }
  }

  const voteUpMutation = useMutation({
    mutationFn: updateBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: removeBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      dispatch({
        type: 'SHOW',
        payload: `you deleted ${blog.title} by ${blog.author}`,
      })
      setTimeout(() => {
        dispatch({ type: 'CLEAR' })
      }, 5000)
    },
  })

  const handleVote = (blog) => {
    voteUpMutation.mutate({ ...blog, likes: blog.likes + 1 })
    dispatch({
      type: 'SHOW',
      payload: `you voted ${blog.title} by ${blog.author}`,
    })
    setTimeout(() => {
      dispatch({ type: 'CLEAR' })
    }, 5000)
  }

  const handleDel = (blog) => {
    if (window.confirm('remove this blog?')) {
      deleteMutation.mutate(blog)
    }
  }

  return (
    <div style={blogStyle}>
      <div className='blog'>
        {blog.title} {blog.author}
        <button id='view-btn' onClick={handleVisibleChange}>
          view
        </button>
      </div>
      <div style={showWhenVisible} className='hiddenContent'>
        <div>
          url: <a href={`${blog.url}`}>{blog.url}</a> <br />
          likes: {blog.likes}
          <button id='like-btn' onClick={(e) => handleVote(blog)}>
            like
          </button>{' '}
          <br />
          user: {blog.user.username} <br />
          <div style={showWhenAuthorized} className='authorizedContent'>
            <button onClick={(e) => handleDel(blog)}>remove</button>
          </div>
        </div>
      </div>
    </div>
  )
}

Blog.displayName = 'blog'

export default Blog

