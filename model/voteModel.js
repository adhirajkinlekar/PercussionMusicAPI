const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'UserId is required'],
        ref: 'User'
    },
    listId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'ItemId is required']
    },
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'ItemId is required'],
        ref: 'item'
    },
    createdDate: Date
})

const vote = mongoose.model('vote', voteSchema)

module.exports = vote;