
const mongoose = require('mongoose')
const app = require('../app')
const supertest = require('supertest')
const bcrypt = require('bcrypt')

const api = supertest(app)

const User = require('../models/user')



beforeEach(async () => {

    await User.deleteMany({})

    const oneUser = new User({
        username:"gooby",
        name:"alex",
        passwordHash: await bcrypt.hash("password", 10)
    })

    await oneUser.save()

})

test('Add a single valid user', async () => {

    const userRequest = {
        username:"TheDude420",
        password:"password"
    }

    const results = await api
        .post("/api/users")
        .send(userRequest)
        .expect(200)
        .expect('Content-Type', /application\/json/ )

    

})

test('Cannot add without username', async () => {

    const userRequest = {
        name:"nice",
        password:"password"
    }

    const results = await api
        .post("/api/users")
        .send(userRequest)
        .expect(400)
        .expect('Content-Type', /application\/json/ )

    expect(results.body.error).toBe('username required and must be 3 or more characters')

})

test('Username must be 3 or more characters', async () => {

    const userRequest = {
        username:"th",
        password:"password"
    }

    const results = await api
        .post("/api/users")
        .send(userRequest)
        .expect(400)
        .expect('Content-Type', /application\/json/ )

    expect(results.body.error).toBe('username required and must be 3 or more characters')

})

test('Cannot add without password', async () => {

    const userRequest = {
        username:"TheDude420",
        name:"nice",
    }

    const results = await api
        .post("/api/users")
        .send(userRequest)
        .expect(400)
        .expect('Content-Type', /application\/json/ )

    expect(results.body.error).toBe('password required and must be 3 or more characters')

})

test('Password must be 3 or more characters', async () => {

    const userRequest = {
        username:"TheDude420",
        password:"pa",
        name:"nice",
    }

    const results = await api
        .post("/api/users")
        .send(userRequest)
        .expect(400)
        .expect('Content-Type', /application\/json/ )

    expect(results.body.error).toBe('password required and must be 3 or more characters')

})

test('Username must be unique', async () => {

    const userRequest = {
        username:"gooby",
        password:"password",
        name:"nice",
    }

    const results = await api
        .post("/api/users")
        .send(userRequest)
        .expect(400)
        .expect('Content-Type', /application\/json/ )

    expect(results.body.error).toBe('User validation failed: username: Error, expected `username` to be unique. Value: `gooby`')

})




afterAll(async () => {
    await User.deleteMany({})
    mongoose.connection.close()
})