//The routs of the buttons
//set up express
const express =require('express')
const Article = require ('./../models/article')
const router = express.Router()

//It will render articles/new, the route of the new article
router.get('/new', (req, res) => {
    res.render('articles/new', {article: new Article()})
})
// the edit route
router.get('/edit/:id', async (req, res) => {
    const article = await Article.findById(req.params.id)
    res.render('articles/edit', {article: article})
})


// We redirect our user to the articles
router.get ('/:slug', async (req, res) =>{
    const article = await Article.findOne({slug:
    req.params.slug}) // we have our article and finding it by slug
    if (article == null) res.redirect('/') // redirects back if something is not ok for the article
    res.render('articles/show', { article: article })

})

//Going to the / route, we submit, it will call the post and go to articles route
router.post('/', async (req,res, next)=>{
    req.article = new Article()
    // middleware that returns the function 
    next()
}, saveArticleAndRedirect('new'))
//edit the article

router.put('/:id', async (req, res, next)=> {
    req.article = await Article.findById(req.params.id)
    next()
}, saveArticleAndRedirect('edit'))
//Creating delete route

//using method-override so we can use other methods instead of GET POST
router.delete('/:id', async  (req, res)=>{
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/')
})

function saveArticleAndRedirect(path) {
    return async (req, res) => {
      let article = req.article
      article.title = req.body.title
      article.description = req.body.description
      article.markdown = req.body.markdown
      try {
        article = await article.save()
        res.redirect(`/articles/${article.slug}`)
      } catch (e) {
        res.render(`articles/${path}`, { article: article })
      }
    }
  }

//We need to export this article.js
module.exports = router
