import { createContext, useReducer, useContext } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SHOW':
      return action.payload
    case 'CLEAR':
      return null
    default:
      return state
  }
}

const NotificationContext = createContext()

export const useNotificationValue = () => {
  const notifyAndDispatch = useContext(NotificationContext)
  return notifyAndDispatch[0]
}

export const useNotificationDispatch = () => {
  const notifyAndDispatch = useContext(NotificationContext)
  return notifyAndDispatch[1]
}

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    null
  )

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext
