import { login } from '../services/loginService'
import { setToken } from '../services/blogService'
import { useNotificationDispatch } from './NotificationContext'
import { useUserDispatch } from './UserContext'

const LoginForm = () => {
  const sendDispatch = useNotificationDispatch()
  const userDispatch = useUserDispatch()

  const handleLogin = async (event) => {
    event.preventDefault()

    const username = event.target.username.value
    const password = event.target.password.value

    try {
      const user = await login({
        username,
        password,
      })

      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user))
      setToken(user.token)

      userDispatch({ type: 'SET', payload: user })
      event.target.username.value = ''
      event.target.password.value = ''

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
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input id='username' name='username' />
        </div>
        <div>
          password
          <input id='password' name='password' />
        </div>
        <button id='login-btn' type='submit'>
          login
        </button>
      </form>
    </div>
  )
}

export default LoginForm
