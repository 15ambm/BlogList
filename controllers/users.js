
const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

userRouter.post('/', async (request, response, next) => {
    const body = request.body

    if(!body.password || body.password.length < 3 ) response.status(400).json({error:"password required and must be 3 or more characters"})
    else if (!body.username || body.username.length < 3) response.status(400).json({error:"username required and must be 3 or more characters"})
    else {
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(body.password, saltRounds)
    
        const user = new User({
            username: body.username,
            name: body.name,
            passwordHash,
        })
        try {
            const savedUser = await user.save()
            response.json(savedUser)
        } catch (e) {
                response.status(400).json({error:e.message})
        }

    }
})

userRouter.get('/', async (request, response) => {

    const users = await User.find({}).populate('blogs', {title:1, author:1, url:1, likes: 1})
    response.json(users)

})


module.exports = userRouter