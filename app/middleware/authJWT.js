let jwt = require('jsonwebtoken');
const config = require('../../config/auth.config');

const verifyToken=function(req,res,next){
    var header=req.headers["authorization"] ;    //check for token   req.headers['x-access-token'] 
     if(header.startsWith("Bearer ")) {        
         header = header.slice(7, header.length).trimLeft();   //token = token.replace('Bearer ', '');
       }

    if(header){
         //const bearer = header.split(' ');
         //const token = bearer[1]
       
        jwt.verify(header,config.secret,(err,decoded) => {
            if(err){
                return res.status(403).send({success:false,message:"Unauthorized access !"});
            }
            req.decoded=decoded;   //req.userId = decoded.id;   set the user to req so other routes can use it
            //console.log(req.decoded);
            next();
            //{ id: '5ee8ce547689ab094c44fe67',           // decoded req
            // name: 'nimal',
            // email: 'nimal@gmail.com',
            // iat: 1592478791,
            // exp: 1592565191 }
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