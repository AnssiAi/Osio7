import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotificationDispatch } from './NotificationContext'
import { updateBlog, removeBlog, commentBlog } from '../services/blogService'
import { useUserValue } from './UserContext'
import { useNavigate } from 'react-router-dom'
import '../style/AppStyle.css'

const Blog = ({ blog }) => {
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
      queryClient.invalidateQueries({ queryKey: ['users'] })

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
    <div className='blogContainer'>
      <h2>
        {blog.title} by {blog.author}
      </h2>
      <div className='blogInfo'>
        <label>url:</label>
        <a href={`${blog.url}`}>{blog.url}</a> <br />
        <label>likes:</label>
        <p>{blog.likes}</p>
        <button
          className='submit-btn'
          id='like-btn'
          onClick={(e) => handleVote()}
        >
          like
        </button>
        <label>added by:</label>
        <p>{blog.user.username}</p>
        <div style={showWhenAuthorized} className='authorizedContent'>
          <button className='del-btn' onClick={(e) => handleDel(blog)}>
            remove
          </button>
        </div>
      </div>

      <div>
        <div className='formContainer'>
          <h3>comments</h3>
          <form className='commentForm' onSubmit={newComment}>
            <input name='comment' />
            <button className='submit-btn' id='comment-btn' type='submit'>
              add comment
            </button>
          </form>
        </div>
        <div className='commentContainer'>
          <ul>
            {blog.comments.map((comment) => (
              <li key={comment.content}>{comment.content}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

Blog.displayName = 'blog'

export default Blog

