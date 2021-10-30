const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Item name is required']
    },
    image: { data: Buffer, contentType: String },
    likes:  [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'vote'
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comment'
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  })

  itemSchema.virtual('likesCount').get(function(){
    return this.likes.length; 
})
const item = mongoose.model('item', itemSchema)

module.exports = item;