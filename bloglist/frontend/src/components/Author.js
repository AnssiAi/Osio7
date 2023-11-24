import Blog from './Blog'

const Author = ({ author }) => {
  //Haetaan blogit?
  if (!author) {
    return null
  }
  return (
    <div>
      <h2>{author.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {author.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}
export default Author
