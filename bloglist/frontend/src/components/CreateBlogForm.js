import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createNew } from '../services/blogService'
import { useNotificationDispatch } from './NotificationContext'

const CreateBlogForm = () => {
  const dispatch = useNotificationDispatch()
  const queryClient = useQueryClient()

  const newBlogMutation = useMutation({
    mutationFn: createNew,
    onError: () => {
      dispatch({
        type: 'SHOW',
        payload: 'unable to create blog',
      })
      setTimeout(() => {
        dispatch({ type: 'CLEAR' })
      }, 5000)
    },
    onSuccess: (response) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], blogs.concat(response))
      dispatch({
        type: 'SHOW',
        payload: `new blog ${response.title} by ${response.author} created`,
      })
      setTimeout(() => {
        dispatch({ type: 'CLEAR' })
      }, 5000)
    },
  })

  const createNewBlog = (event) => {
    event.preventDefault()
    const title = event.target.title.value
    const author = event.target.author.value
    const url = event.target.url.value
    event.target.title.value = ''
    event.target.author.value = ''
    event.target.url.value = ''
    newBlogMutation.mutate({ title, author, url, likes: 0, comments: [] })
  }

  return (
    <div>
      <h2>create new</h2>
      <form id='blog_form' onSubmit={createNewBlog}>
        <div>
          title:
          <input name='title' />
        </div>
        <div>
          author:
          <input name='author' />
        </div>
        <div>
          url:
          <input name='url' />
        </div>
        <button id='create-btn' type='submit'>
          create
        </button>
      </form>
    </div>
  )
}

export default CreateBlogForm

