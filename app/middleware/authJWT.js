let jwt = require('jsonwebtoken');
const config = require('../../config/auth.config');

const verifyToken=function(req,res,next){
    var token=req.headers['authorization'] || req.params.token;    //check for token   req.headers['x-access-token'] 
    if(token.startsWith('Bearer ')) {        
        token = token.slice(7, token.length);   //token = token.replace('Bearer ', '');
      }
    if(token){
        jwt.verify(token,config.secret,(err,decoded) => {
            if(err){
                return res.status(401).send({success:false,message:"Unauthorized access !"});
            }
            req.decoded=decoded;   //req.userId = decoded.id;   set the user to req so other routes can use it
            next();
            
        })
    }else{
        return res.status(404).send({message:"No token provided "});
    }

}

// const generateToken = (user) =>{
//     const payload = {
//         name = user.name,
//         email = user.email,
  //       _id: user._id.toString(),
//     }
//     return token = jwt.sign(payload, config.secret, {
//         expiresIn: 60 * 60 * 24 // expires in 24 hours
//       });
// }


// // TODO : validations in signup or login

//const authJwt = {
    // verifyToken,
//    // generateToken
//}
 module.exports= verifyToken