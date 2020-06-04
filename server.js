//Create server
const express = require('express')
const mongoose = require('mongoose')
const Article = require('./models/article')
//We take the articles
const articleRouter = require('./routes/articles')
const methodOverride = require('method-override')
const app = express()

//Connecting to our database mongo
mongoose.connect('mongodb://localhost/blog', { useNewUrlParser: true, useUnifiedTopology:true, useCreateIndex: true
})



//Print HTML to our server, setting up our view engine
// We will write our view using ejs and that view engine will convert to html

app.set('view engine', 'ejs')



//We can access the different parameters from article form inside of our article route with req.body.text

app.use(express.urlencoded({extended: false}))

//Use the method override
app.use(methodOverride('_method'))

//Create route
// / for the index rout- main rout
app.get('/', async (req,res) => {
    //This is the article
    const articles = await Article.find().sort({ 
        createdAt: 'desc' })
     // Will find all the articles created
    //We want to render the index.ejs
    res.render('articles/index', {articles: articles})  // we want to pass all of our routes to this, will be available in index.ejs

})

//Use the article, also everytime we use it, it creates a rout in the url /articles
app.use('/articles', articleRouter)

app.listen(5000)