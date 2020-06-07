const express = require("express");
const router = express.Router();
const User = require("../models/users.model");
const bcrypt =require("bcrypt");
const verifyToken = require('../middleware/authJWT');
const jwt=require("jsonwebtoken");
const config=require('../../config/auth.config.js');

/**
 * @route   POST /users/save
 * @desc    Save user
 * @access  Private
 */

router.post("/save", (req, res) => {
  const user = new User(req.body);
  console.log(req.body);
  user
    .save()
    .then((result) => {
      console.log(result);
      res.send(result);
    })
    .catch((err) => {
      res.status(400);
      console.log(err);
    });
  res.status(200);
});

/**
 * @route   GET /users
 * @desc    Retrieve all users
 * @access  Private
 */

router.get("/get", async (req, res) => {
  try {
    const users = await User.find();
    if (!users) throw Error("No users exist");
    res.json(users);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

/**
 * @route   GET /users/:id
 * @desc    Retrieve user
 * @access  Private
 */

router.get("/get/:id", (req, res) => {
  User.findById(req.params.id)
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      console.log(err);
    });
  res.status(200);
});

/**
 * @route   PUT /users/update/:id
 * @desc    Update user
 * @access  Private
 */

router.put("/update/:id", (req, res) => {
  User.updateOne(
    {
      _id: req.params.id,
    },
    req.body,
    { upsert: true }
  )
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
  res.status(200);
});


/**
 * @route   Post /user/register/
 * @desc    Register user
 * @access  Private
 */

router.post('/register',(req,res)=>{

  User
    .findOne({email:req.body.email})
    .then(user =>{
      if(user){
        return res.status(400).json({ email: "Email already exists" });
      }
      else{
      
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) throw err;
            const newUser = new User({
              name: req.body.name,
              email: req.body.email,
              password: hash
              // TODO : isEmailVerified: false   email verfication
           })
           // newUser.password = hash;
            newUser
              .save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          });
      
      }
    })
    .catch(err=>{
      console.log(err);
      return res.status(400).json(err);
    })

})


 /**
 * @route   Post /user/login/
 * @desc    login user
 * @access  Private
 */

router.post('/login',(req,res)=>{

  const email =req.body.email;
  const password =req.body.password;

  User
    .findOne({email})
    .then(user =>{
      if(user){
        bcrypt.compare(password,user.password).then(isMatch=>{
          if(isMatch){
              // User matched
              // Create JWT Payload 
              const payload={
                  id: user._id,
                  name:user.name,
                  email:user.email
              };
              //sign token
              jwt.sign(
                  payload,
                  config.secret,
                  {
                      expiresIn: 86400//1 day in seconds
                  },
                  (err,token)=>{
                      res.json({
                          success:true,
                          message: 'Authentication successful!',
                          token:"Bearer "+token
                      });
                  }
              );
          }else{
              return res.status(400).json({incorrect: "Incorrect Username or password"});
          }
      });

      }
      else{
        return res.status(404).json({incorrect: "Incorrect Username or password"});
      }
    })
    .catch(err=>{
      console.log(err);
      return res.status(400).json(err);
    })
})

module.exports = router;
