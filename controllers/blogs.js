
const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
    
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
    
    const blogData = request.body
    if(!blogData.hasOwnProperty('title') || !blogData.hasOwnProperty('url')) {
        response.status(400).end()
    } else {
        const blog = new Blog(blogData)
        const result = await blog.save()
        response.status(201).json(result)
    }

})

module.exports = blogRouter