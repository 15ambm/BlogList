
const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {username:1, name:1})
    response.json(blogs)
})

blogRouter.post('/', async (request, response) => {

    try {
        decodedToken = await jwt.verify(request.token, process.env.SECRET)
    } catch (e) {
        return response.status(401).json({error:"token missing or invalid"})
    }

    const user = await User.findById(decodedToken.id)
    const blogData = {...request.body, user:user._id}

    if(!blogData.hasOwnProperty('title') || !blogData.hasOwnProperty('url')) {
        response.status(400).json({error:"missing fields"})
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

    try {
        decodedToken = await jwt.verify(request.token, process.env.SECRET)
    } catch (e) {
        return response.status(401).json({error:"token missing or invalid"})
    }
    const user = await User.findById(decodedToken.id)
    const result = await Blog.findById(request.params.id)

    try {
        if(user._id.toString() === result.user.toString()) {
            const deletedBlog = await Blog.findByIdAndDelete(request.params.id)
            return response.status(204).json(deletedBlog)
        } else {
            response.status(404).json({error:"cannot delete this post"})
        }
    } catch (e) {
        response.status(404).json({error:"cannot find the blog post"})
    }

})

blogRouter.put('/:id', async (request, response) => {

    const updatedObject = request.body
    const result = await Blog.findByIdAndUpdate(request.params.id, updatedObject)

    if(result) response.status(200).end()
    else response.status(404).end()

})

module.exports = blogRouter