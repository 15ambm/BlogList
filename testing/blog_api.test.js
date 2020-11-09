
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

test('GET request to /api/blogs', async () => {
    
    const results = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/ )
        .then()

    expect(results.body).toHaveLength(initialBlogs.length)
    

})

afterAll(() => {
    mongoose.connection.close()
})
  