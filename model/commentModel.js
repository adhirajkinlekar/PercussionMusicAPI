const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    text: String,
    likes: Number,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdDate:Date,
    modifiedDate:Date
})

const comment = mongoose.model('comment', commentSchema)

module.exports = comment;