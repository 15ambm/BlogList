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

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}