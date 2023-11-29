import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createNew } from '../services/blogService'
import { useNotificationDispatch } from './NotificationContext'
import '../style/AppStyle.css'

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
      queryClient.invalidateQueries(['blogs'])
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
    <div className='formContainer'>
      <h3>create new</h3>
      <form className='blogForm' onSubmit={createNewBlog}>
        <label>title:</label>
        <input name='title' />

        <label>author:</label>
        <input name='author' />

        <label>url:</label>
        <input name='url' />

        <button id='create-btn' type='submit'>
          create
        </button>
      </form>
    </div>
  )
}

export default CreateBlogForm

