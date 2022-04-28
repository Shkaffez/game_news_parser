const { Schema, model } = require('mongoose');

const articleSchema = new Schema({
    link:  {
        type: String,
        unique: true,
    }, 
    author: String, 
    title:  String,  
    text:String,
    platforms: [String],
});

module.exports = model('Article', articleSchema);