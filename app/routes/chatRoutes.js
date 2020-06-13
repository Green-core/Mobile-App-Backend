const express = require("express")
const router = express.Router()
const Chat = require("../models/chatModel")
const { ObjectId } = require('mongodb');

/**
 * @route   POST /chats/reply
 * @desc    Reply chat
 * @access  Private
 */

router.post("/reply", (req, res) => {

  const reply = {
    _id: new ObjectId(),
    reply: req.body.reply,
    from: req.body.from,
    fromID: new ObjectId(req.body.fromId),
    date: new Date()
  }

  Chat.update(
    { _id: new ObjectId(req.body.id) },
    {
      updatedAt: new Date(),
      $push: { replies: reply }
    },
    { upsert: true }
  ).then((result) => {
    res.send(result)
  })
    .catch((err) => {
      console.log(err)
    })
  res.status(200)
})


/**
 * @route   POST /chats/send-message
 * @desc    Send Message
 * @access  Private
 */

router.post("/send-message", (req, res) => {
  const chat = new Chat(req.body)

  chat
    .save()
    .then((result) => {
      res.send(result)
    })
    .catch((err) => {
      res.status(400)
      console.log(err)
    })
  res.status(200)
})



/**
 * @route   POST /chats/get-all
 * @desc    Retrieve all chats
 * @access  Private
 */

router.post("/get-all", (req, res) => {
  console.log("Hello")
  console.log(req.body.userID)
    Chat.find(
      {
        $and:[
          {
            $or:[
              {fromID: req.body.userID}, 
              {toID: req.body.userID}
            ]
          }, 
          {deleted:{$ne: true} }
        ]
      }
    )
    .then((result) => {
      res.json(result)
    })
    .catch((err) => {
      console.log(err);
      res.json(err)
    });
    res.status(200);
});


/**
 * @route   POST /chats/get-one
 * @desc    Retrieve chat
 * @access  Private
 */

router.post("/get-one", (req, res) => {
  Chat.findById(req.body.id)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log(err);
    });
  res.status(200);
});



/**
 * @route   GET /chats/get-all-unread
 * @desc    Retrieve all unread chats
 * @access  Private
 */

router.get("/get-all-unread", async (req, res) => {
  try {
    const chats = await Chat.find({ $and:[{newFromUser: true}, {deleted:{$ne: true} }]});
    if (!chats) throw Error("No chats exist");
    res.json(chats);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});


/**
 * @route   POST /chats/viewed-message
 * @desc    Update viewed message
 * @access  Private
 */

router.post("/viewed-message", (req, res) => {

  Chat.update(
    { _id: new ObjectId(req.body.id) },
    {
      updatedAt: new Date(),
      newFromAdmin: false
    },
    { upsert: true }
  ).then((result) => {
    res.send(result)
  })
    .catch((err) => {
      console.log(err)
    })
  res.status(200)
})


/**
 * @route   POST /chats/delete-chat
 * @desc    Delete chat
 * @access  Private
 */

router.post("/delete-chat", (req, res) => {

  Chat.update(
    { _id: new ObjectId(req.body.id) },
    {
      deleted: true,
      deletedBy: req.body.userId
    },
    { upsert: true }
  ).then((result) => {
    res.send(result)
  })
    .catch((err) => {
      console.log(err)
    })
  res.status(200)
})



module.exports = router