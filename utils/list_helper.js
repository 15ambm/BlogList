const blogRouter = require("../controllers/blogs")


const dummy = blogs => {
    return 1
}

const totalLikes = (blogs) => {
    let total = 0 
    blogs.forEach(element => {
        total += element.likes
    });
    return total
}

const favoriteBlog = blogs => {
    blogs.length > 1 ? top = blogs[0] : top = 0
    blogs.forEach( blog => {if(blog.likes > top.likes) top = blog} )
    return top
 }

const mostBlogs = blogs => {
    if(blogs.length < 1) return {}
    let count = new Map()
    let most = { blogs:0 }
    blogs.forEach(blog => {
        if(count.has(blog.author)) {
            let likes =  count.get(blog.author) + 1
            count.set(blog.author, likes + 1)
            if(likes > most.blogs) most = {author:blog.author, blogs:likes} 
        }
        else count.set(blog.author, 1)
    })
    return most
}



module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs
}