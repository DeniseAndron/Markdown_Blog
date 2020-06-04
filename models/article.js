//import mongoose
const mongoose = require('mongoose')
const marked = require('marked')
const slugify = require('slugify')
const createDomPurify = require('dompurify')
const {JSDOM} = require ('jsdom')
//This will allow us to create html and purify
const dompurify = createDomPurify(new JSDOM().window)

const articleSchema = new mongoose.Schema ({
    title: {
        type:String,
        required: true
    },
    description:{
        type:String
    },
    markdown: {
        type:String,
        required:true
    },
    createdAt: {
        type: Date,
        default: Date.now //call a function when we create a new article withthe date
    },
    //the slug will be unique, we calculate it once and save it in our database
    slug: {
    type: String,
    required: true,
    unique: true
    },
    sanitizedHtml: {
        type: String,
        required: true
    }
})

//We will run first this function everytime we save, update, create etc
articleSchema.pre('validate', function(next){
    //create our slug from our title, strict means that will be removed any long slugs
    if(this.title) {
        this.slug = slugify(this.title, {lower: true, strict:true})
    }

    if (this.markdown) {
        //gets rid of any unwanted html code
        this.sanitizedHtml = dompurify.sanitize (marked (this.markdown))
    }

    next()
})

//Will export in the article db
module.exports = mongoose.model ('Article', articleSchema)