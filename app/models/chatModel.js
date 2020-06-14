const mongoose = require("mongoose")
const { ObjectId } = require('mongodb');

const ChatSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    from :{
        type: String,
        required: true
    },
    fromID: {
        type: ObjectId,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    toID: {
        type: ObjectId,
        required: true
    },
    priority: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    replies: {
        _id: {
            type: ObjectId,
        },
        reply: {
            type: String
        },
        from: {
            type: String
        }, 
        fromID: {
            type: ObjectId
        },
        date: {
            type: Date
        }
    },
    closed: {
        type: Boolean,
        default: false
    },
    newFromUser: {
        type: Boolean,
        default: true
    },
    newFromAdmin: {
        type: Boolean,
        default: false
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deletedBy: {
        type: ObjectId,
    }
})

module.exports = mongoose.model("chat", ChatSchema)