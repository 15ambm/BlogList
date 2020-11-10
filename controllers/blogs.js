
const blogRouter = require('express').Router()
const { response } = require('express')
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