
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

const blogRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')

const mongoUrl = require('./utils/config').MONGODB_URI
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)

module.exports = app