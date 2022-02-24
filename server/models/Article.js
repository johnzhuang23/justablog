const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: 'This field is required.'
    },
    author: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now()
    },
    category: {
        type: String,
        enum: ["Study", "Fantasy", "IT", "Food", "Travel", "Fashion"]
    },
    image: {
        type: String,
    },
    description: {
        type: String
    },

});
articleSchema.index({ title: "text", description: "text" })
// articleSchema.index({ "$**": "text" })
module.exports = mongoose.model('Article', articleSchema)