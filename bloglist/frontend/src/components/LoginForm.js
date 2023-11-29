import { login } from '../services/loginService'
import { setToken } from '../services/blogService'
import { useNotificationDispatch } from './NotificationContext'
import { useUserDispatch } from './UserContext'
import { useNavigate } from 'react-router-dom'
import '../style/AppStyle.css'

const LoginForm = () => {
  const sendDispatch = useNotificationDispatch()
  const userDispatch = useUserDispatch()
  const navigate = useNavigate()

  const handleLogin = async (event) => {
    event.preventDefault()

    const username = event.target.username.value
    const password = event.target.password.value

    try {
      const user = await login({
        username,
        password,
      })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      setToken(user.token)

      userDispatch({ type: 'SET', payload: user })
      event.target.username.value = ''
      event.target.password.value = ''

      navigate('/')

      sendDispatch({ type: 'SHOW', payload: `logged in as ${username}` })
      setTimeout(() => {
        sendDispatch({ type: 'CLEAR' })
      }, 5000)
    } catch (exception) {
      sendDispatch({ type: 'SHOW', payload: 'wrong username or password' })
      setTimeout(() => {
        sendDispatch({ type: 'CLEAR' })
      }, 5000)
    }
  }

  return (
    <div className='loginFormContainer'>
      <div className='loginPlacement'>
        <h2>Log in to application</h2>

        <form className='loginForm' onSubmit={handleLogin}>
          <label>username</label>
          <input id='username' name='username' />

          <label>password</label>
          <input id='password' name='password' />

          <button id='login-btn' type='submit'>
            login
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginForm
