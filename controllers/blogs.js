
const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {username:1, name:1})
    response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
    
    const user = await User.findOne({})
    const blogData = {...request.body, user:user._id}

    if(!blogData.hasOwnProperty('title') || !blogData.hasOwnProperty('url')) {
        response.status(400).end()
    } else {
        const blog = new Blog(blogData)
        const result = await blog.save()
        try {
            user.blogs = await user.blogs.concat(result._id)
            await user.save()
            response.status(201).json(result)
        } catch (e) {
            response.status(400).end()
        }
    }

})

blogRouter.delete('/:id', async (request, response) => {

    const result = await Blog.findByIdAndRemove(request.params.id)

    if(result) response.status(204).end()
    else response.status(404).end()

})

blogRouter.put('/:id', async (request, response) => {

    const updatedObject = request.body
    const result = await Blog.findByIdAndUpdate(request.params.id, updatedObject)

    if(result) response.status(200).end()
    else response.status(404).end()

})

module.exports = blogRouter