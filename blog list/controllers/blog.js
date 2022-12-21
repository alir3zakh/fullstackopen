const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({})
    .populate('user', { name: 1, username: 1 })
  res.json(blogs)
})

blogsRouter.put('/:id', async (req, res) => {
  const { title, author, url, likes, user } = req.body

  const updated_blog = await Blog.findByIdAndUpdate(
    req.params.id,
    { title, author, url, likes, user },
    { new: true, runValidators: true, context: 'query' }
  )

  res.json(updated_blog)
})

blogsRouter.post('/', async (req, res) => {
  const decodedToken = jwt.verify(req.token, process.env.SECRET)

  if (!decodedToken) {
    return response.status(401)
      .json({ error: 'invalid or missing token' })
  }

  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title: req.body.title,
    author: req.body.author,
    url: req.body.url,
    likes: req.body.likes || 0,
    user: user._id
  })

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  res.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (req, res) => {
  const decodedToken = jwt.verify(req.token, process.env.SECRET)


  if (!decodedToken) {
    return response.status(401) // 401: Unauthorized
      .json({ error: 'invalid or missing token' })
  }

  const blog = await Blog.findById(req.params.id)
  const user = await User.findById(decodedToken.id)

  if (user._id.toString() !== blog.user.toString()) {
    return res.status(403) // 403: Forbidden
      .json({ error: 'invalid permission' })
  }

  await Blog.findByIdAndRemove(req.params.id)

  res.status(204).end() // 204: no content
})

module.exports = blogsRouter
