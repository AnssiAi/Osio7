import { useNotificationValue } from './NotificationContext'

const Notification = () => {
  const notification = useNotificationValue()

  const style = {
    color: 'white',
    background: 'green',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  }

  if (notification) {
    return <div style={style}>{notification}</div>
  }
}

export default Notification

