
const mongoose = require('mongoose')
const app = require('../app')
const supertest = require('supertest')
const bcrypt = require('bcrypt')

const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

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

    const initialUser = {
        username:"GOOB",
        name:"alex",
        passwordHash: await bcrypt.hash("password", 10)
    }

    await Blog.deleteMany({})
    await User.deleteMany({})

    const blogs = initialBlogs.map(b => new Blog(b))

    for(let b of initialBlogs) {
        blog = new Blog(b)
        await blog.save()
    }

    const user = new User(initialUser)
    await user.save()

})

test('Cannot add a blog without logging in/token authentication', async () => {
    
    const newBlog = {
        title: "New Blog",
        author: "GOOB",
        url: "No",
        likes: 69
    } 

    const results = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)

    expect(results.body.error).toBe("token missing or invalid")

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

    expect(results.body[0]).toHaveProperty('id')

})

test('Can add a new blog to the database', async () => {

    const loginInformation = {
        username:"GOOB",
        password: "password"
    }

    const loginResponse = await api
        .post('/api/login')
        .send(loginInformation)
        .expect(200)

    const newBlog = {
            title: "New Blog",
            author: "GOOB",
            url: "No",
            likes: 69
        } 

    await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${loginResponse.body.token}` )
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

test('Blogs missing likes default to 0 likes', async () => {   
    
    const loginInformation = {
        username:"GOOB",
        password: "password"
    }

    const loginResponse = await api
        .post('/api/login')
        .send(loginInformation)
        .expect(200)


    const newBlog = {
            title: "New Blog",
            author: "Rich Johnson",
            url: "No",  
           } 

    await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${loginResponse.body.token}` )
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

   const results = await api
       .get('/api/blogs')
       .expect(200)
       .expect('Content-Type', /application\/json/)

    expect(results.body[3]).toHaveProperty('likes')
    expect(results.body[3].likes).toBe(0)

})

test('Blogs missing title and url property return 400 bad request', async () => {
    

    const loginInformation = {
        username:"GOOB",
        password: "password"
    }

    const loginResponse = await api
        .post('/api/login')
        .send(loginInformation)
        .expect(200)


    const newBlog = {
        author: "Rich Johnson",
        likes: 123
    } 
    
    await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${loginResponse.body.token}` )
        .send(newBlog)
        .expect(400)
        .expect('Content-Type', /application\/json/)

   const results = await api
       .get('/api/blogs')
       .expect(200)
       .expect('Content-Type', /application\/json/)

    expect(results.body).toMatchObject(initialBlogs)

})

test('Can delete a blog', async () => {
    
    const loginInformation = {
        username:"GOOB",
        password: "password"
    }

    const loginResponse = await api
        .post('/api/login')
        .send(loginInformation)
        .expect(200)
    
    const newBlog = {
            title: "New Blog",
            author: "GOOB",
            url: "No",
            likes: 69
        } 

    const blog = await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${loginResponse.body.token}` )
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    await api
        .delete(`/api/blogs/${blog.body.id}`)
        .set('Authorization', `bearer ${loginResponse.body.token}` )
        .expect(204)

    const postDeleteResults = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
 

})

test('Can update a blog', async () => {
    
    const newBlogContent = {
        likes: 0
    }

    const preUpdateResults = await api
       .get('/api/blogs')
       .expect(200)
       .expect('Content-Type', /application\/json/)

    const preUpdateObject = preUpdateResults.body[0]
       
    await api
        .put(`/api/blogs/${preUpdateResults.body[0].id}`)
        .send(newBlogContent)
        .expect(200)

    const postUpdateResults = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/) 
    
    const updatedObject = postUpdateResults.body.find(b => b.id === preUpdateResults.body[0].id)        
    expect(updatedObject).toMatchObject({...preUpdateObject, likes:0})

})

afterAll(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})
    mongoose.connection.close()
})
  