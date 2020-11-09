
const mongoose = require('mongoose')
const app = require('../app')
const supertest = require('supertest')

const api = supertest(app)

const Blog = require('../models/blog')

const initialBlogs = [
    {  
        title: "Blog 1",
        author: "Nice Name",
        url: "No",
        likes: 34
    },
    {  
        title: "Blog 2",
        author: "Abraham",
        url: "No",
        likes: 10
    },
    {  
        title: "Blog 3",
        author: "Mikael",
        url: "No",
        likes: 6
    },
]
beforeEach(async () => {

    await Blog.deleteMany({})

    const blogs = initialBlogs.map(b => new Blog(b))

    for(let b of initialBlogs) {
        blog = new Blog(b)
        await blog.save()
    }

})

test('GET request to /api/blogs returns correct blogs', async () => {
    
    const results = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/ )

    expect(results.body).toHaveLength(initialBlogs.length)
    expect(results.body).toMatchObject(initialBlogs)

})

test('Blogs have id property', async () => {
    
    const results = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/ )

    console.log(results.body)
    expect(results.body[0]).toHaveProperty('id')

})


test('Can add a new blog to the database', async () => {

    const newBlog = {
        title: "New Blog",
        author: "Rich Johnson",
        url: "No",
        likes: 69
    } 
    
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const results = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

    expect(results.body).toHaveLength(initialBlogs.length + 1)
    
    const newData = initialBlogs.concat(newBlog)
    expect(results.body).toMatchObject(newData)

})

afterAll(async () => {
    await Blog.deleteMany({})
    mongoose.connection.close()
})
  