import { useNotificationValue } from './NotificationContext'
import '../style/AppStyle.css'

const Notification = () => {
  const notification = useNotificationValue()

  if (notification) {
    return <div className='notification'>{notification}</div>
  }
}

export default Notification

