const express = require("express");
const router = express.Router();
const User = require("../models/users.model");
const bcrypt = require("bcrypt");
const verifyToken = require("../middleware/authJWT");
const jwt = require("jsonwebtoken");
const config = require("../../config/auth.config.js");
const { check,validationResult } = require('express-validator');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const seedrandom = require('seedrandom');


/**
 * @route   GET /users/check
 * @desc    Check user password using id
 * @access  Private
 */

router.post("/check", (req, res) => {
  User.findOne({ _id: req.body.id })
    .then((user) => {
      if (!user) {
        console.log('No such user')
        return res.status(200).json({ status: false });
      } else {
        console.log(user.password);
        bcrypt.compare(req.body.password, user.password).then((isMatch) => {
          console.log(isMatch);
          if (isMatch) {
            res.status(200).json(true);
          } else {
            res.status(200).json(false);
          }
        });
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json(err);
    });
});

/**
 * @route   PUT /users/update/
 * @desc    Update user data
 * @access  Private
 */

router.put("/update/", (req, res) => {
  const userId = req.body.password
  const hash = bcrypt.hashSync(userId , 10);
  console.log(req.body.id , hash)
  User.updateOne(
    {
      _id: req.body.id,
    },
    { password: hash },
    { upsert: true }
  )
    .then((result) => {
      res.send(hash);
    })
    .catch((err) => {
      console.log(err);
    });
  res.status(200);
});




/**
 * @route   PUT /users/account/update/
 * @desc    Update account data
 * @access  Private
 */

router.put("/account/update/", (req, res) => { 
  console.log(JSON.stringify(req.body))
  User.updateOne(
    {
      _id: req.body.id,
    },
    { name: req.body.name,
      mobile: req.body.mobile},
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
//// add verifyToken as middleware to test AuthHomeScreen remove it for other not protected components
router.get("/get/:id", (req, res) => {  
  User.findById(req.params.id)     //req.decoded.id instead of req.params.id
    .then((doc) => {
      res.json(doc);
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

router.post("/register",
[
  check('name','Name is required').not().isEmpty(),
  check('email')
    .isEmail().normalizeEmail().withMessage('Email must be valid')
    .custom(value=>{
      return User.findOne({email:value}).then(user=>{
        if (user){
          throw new Error("Email Already Exists");
        }
        return true;
      })
    }),
  check('password',"Password must be at least 6 characters").isLength({ min: 6 }),
  check('confirmPassword','Password confirmation is required')
    .not()
    .isEmpty()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
          throw new Error("Password confirmation is incorrect");
      } 
      return true;
  }),
],
(req, res) => {
  var errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array())
    return res.status(422).json(errors.array());
  }
  // User.findOne({ email: req.body.email })
  //   .then((user) => {
  //       if (user) {
  //         return res.status(400).json({ email: "Email already exists" });
  //       } 
  //       else {
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) throw err;
            const newUser = new User({
              name: req.body.name,
              email: req.body.email,
              password: hash,
              // TODO : isEmailVerified: false   email verfication
            });
            // newUser.password = hash;
            newUser
              .save()
              .then((user) => res.status(200).json(user))
              .catch((err) => console.log(err));
          });
        })
      //})
    // .catch((err) => {
    //   console.log(err);
    //   return res.status(404).json(err);
    // });
//})
    

/**
 * @route   Post /user/login/
 * @desc    login user
 * @access  Private
 */

router.post("/login",
// [
//   check('email').isEmail().withMessage('Email must be valid'),
//   check('password', 'Password is requried').not().isEmpty(),
// ],
(req, res) => {
  // var errors = validationResult(req.body);
  // if (!errors.isEmpty()) {
  //   return res.status(422).json({ errors: errors.array() });
  // }
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        bcrypt.compare(password, user.password).then((isMatch) => {
          if (isMatch) {
            // User matched
            // Create JWT Payload
            const payload = {
              id: user._id,
              name: user.name,
              email: user.email,
            };
            //sign token
            jwt.sign(
              payload,
              config.secret,
              {
                expiresIn: 86400, //1 day in seconds
              },
              (err, token) => {
                res.status(200).json({
                  id:user._id,
                  email:user.email,
                  token: token,
                });
              }
            );
          } else {
            return res
              .status(400)
              .send({ err: "Incorrect Username or password" });
          }
        });
      } else {
        return res
          .status(400)
          .send({ err: "Incorrect Username or password" });
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(404).send(err);
    });
});

/**
 * @route   Post /user/forgotPassword/
 * @desc    Forgot password email request 
 * @access  Private
 */
router.post("/forgotPassword",[
  check('email')
    .isEmail().withMessage('Email must be valid')
    .custom(value=>{
      return User.findOne({email:value}).then(user=>{
        if (!user){
          throw new Error("Email doesn't Exist");
        }
        return true;
      })
    })
  ],
  (req, res) => {
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array())
      return res.status(422).json(errors.array());
    }
  //  const token = crypto.randomBytes(20).toString('hex');       //generate token 
   // console.log(token)
   // var prng = new seedrandom();
   // console.log(prng()); 
    const rng = seedrandom(
      crypto.randomBytes(64).toString('base64'), 
      { entropy: true }
    );
    const token = (rng()).toString().substring(3, 9);
    //console.log('code = ',token)

     User.findOneAndUpdate({email: req.body.email},{resetPasswordToken : token,resetPasswordExpire : Date.now() + 3600000},{new:true})
     .then(res=>console.log(res))
     .catch(err=>res.status(400).send({err:"Email doesn't exist"}))         //token didn't update in db 
   //  .then(res=>{
     //  if(res){
         //  console.log(res)
          const transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: config.email,
                pass: config.emailPassword,
              },
            });
    
            const mailOptions = {
              from: 'greencoreorg27@gmail.com',
              to: 'kavigamage23@gmail.com',
              subject: 'Reset Password',
              text:
                'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n'
                + 'Please use the following code to reset password in Green Core App. Complete the process within one hour of receiving it:\n\n'
                + `${token}\n\n`
                + 'If you did not request this, please ignore this email and your password will remain unchanged.\n',
            };
    
            console.log('sending mail');
            transporter.sendMail(mailOptions, (err, response) => {
              if (err) {
                console.error('there was an error: ', err);       //email didn't send to user
                res.status(404).json({err:"Sending email failed try again"})
              } else {
                console.log('here is the res: ', response);
                res.status(200).json(response);
              }
            });
       //   }
      //  })
       // .catch(err=>console.log(err))
        }
      )
      

/**
 * @route   Post /user/checkToken/
 * @desc    check Token  
 * @access  Private
 */
router.post("/checkToken",[
  check('email')
    .custom(value=>{
      return User.findOne({email:value}).then(user=>{
        if (!user){
          throw new Error("Email doesn't Exist");
        }
        return true;
      })
    })
  ],
  (req, res) => {
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array())
      return res.status(422).json(errors.array());
    }
    User.findOneAndUpdate({email:req.body.email,resetPasswordToken:req.body.token,resetPasswordExpire:{"$gt":Date.now()}},{resetPasswordToken:null,resetPasswordExpire:null},{new:true})
        .then(data=>{
          if(data){
            console.log(data);
            return res.status(200).send(data)
          }
          else{
            res.status(400).send({err:'Token is expired or invalid'})
          }
        })
        .catch((err) => console.log(err));
  }
)

 /**
 * @route   Post /user/resetPassword/
 * @desc    Reset password 
 * @access  Private
 */

 router.post('/resetPassword',[
  check('password',"Password must be at least 6 characters").isLength({ min: 6 }),
  check('confirmPassword','Password confirmation is required')
    .not()
    .isEmpty()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation is incorrect");
      }  
      return true;
    }),
  ],
  (req,res)=>{
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array())
      return res.status(422).json(errors.array());
    }
      User
        .findOne({email:req.body.email})
        .then((user)=>{
          if(user){
            bcrypt.hash(req.body.password, 10, (err, hash) => {
              if (err) throw err;
              user.password= hash
              user
                .save()
                .then((user) => res.status(200).json(user))
                .catch((err) => console.log(err));
            });
          }
          else{
            return res.status(400).send({err:'Email not found'})
          }
        })
  }
 )
// password reset confirmation email
module.exports = router;
