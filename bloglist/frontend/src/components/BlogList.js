import { useQuery } from '@tanstack/react-query'
import { getAll } from '../services/blogService'
import { useUserValue } from './UserContext'

import Blog from './Blog'

const BlogList = () => {
  const user = useUserValue()
  //Haetaan blogit palvelimelta
  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: getAll,
    retry: 1,
    refetchOnWindowFocus: false,
  })
  //Viestit odottaessa ja virheen tapahtuessa
  if (result.isPending) {
    return <span>Loading data</span>
  }
  if (result.isError) {
    return <span>blog service not available due to server problem</span>
  }
  //Haetut blogit
  const blogs = result.data

  return (
    <div>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} user={user.username} />
      ))}
    </div>
  )
}

export default BlogList
