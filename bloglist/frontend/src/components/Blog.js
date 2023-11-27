import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotificationDispatch } from './NotificationContext'
import { updateBlog, removeBlog, commentBlog } from '../services/blogService'
import { useUserValue } from './UserContext'
import { useNavigate } from 'react-router-dom'

const Blog = ({ blog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const [authorized, setAuthorized] = useState(false)

  const user = useUserValue()
  const queryClient = useQueryClient()
  const dispatch = useNotificationDispatch()
  const navigate = useNavigate()

  const showWhenAuthorized = { display: authorized ? '' : 'none' }

  useEffect(() => {
    if (user.username === blog.user.username) {
      setAuthorized(true)
    } else {
      setAuthorized(false)
    }
  }, [])

  const voteUpMutation = useMutation({
    mutationFn: updateBlog,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: removeBlog,
    onSuccess: () => {
      navigate('/')
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

  const handleVote = () => {
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

  const commentMutation = useMutation({
    mutationFn: commentBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })
  const newComment = (event) => {
    event.preventDefault()
    const comment = {
      content: event.target.comment.value,
    }
    event.target.comment.value = ''
    commentMutation.mutate({ id: blog.id, comment: comment })
  }

  if (!blog) {
    return null
  }
  return (
    <div style={blogStyle} className='blog'>
      <h2>
        {blog.title} by {blog.author}
      </h2>
      url: <a href={`${blog.url}`}>{blog.url}</a> <br />
      likes: {blog.likes}
      <button id='like-btn' onClick={(e) => handleVote()}>
        like
      </button>
      <br />
      added by: {blog.user.username}
      <div style={showWhenAuthorized} className='authorizedContent'>
        <button onClick={(e) => handleDel(blog)}>remove</button>
      </div>
      <h3>comments</h3>
      <form id='comment_form' onSubmit={newComment}>
        <input name='comment' />
        <button id='comment-btn' type='submit'>
          add comment
        </button>
      </form>
      <ul>
        {blog.comments.map((comment) => (
          <li key={comment.content}>{comment.content}</li>
        ))}
      </ul>
    </div>
  )
}

Blog.displayName = 'blog'

export default Blog

