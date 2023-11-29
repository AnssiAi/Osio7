import { useRef } from 'react'
import { Link } from 'react-router-dom'

import CreateBlogForm from './CreateBlogForm'
import Togglable from './Togglable'
import '../style/AppStyle.css'

const BlogList = ({ blogs }) => {
  const blogFormRef = useRef()
  return (
    <div className='listContainer'>
      <h2>Blogs</h2>
      <Togglable buttonLabel='create new' ref={blogFormRef}>
        <CreateBlogForm />
      </Togglable>
      <ul>
        {blogs.map((b) => (
          <li key={b.id}>
            <Link to={`/blogs/${b.id}`}>{b.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default BlogList
