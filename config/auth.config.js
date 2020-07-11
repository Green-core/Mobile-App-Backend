require('dotenv').config();

module.exports = {
    secret: `${process.env.SECRET}`,
    email:  `${process.env.EMAIL}`,
    emailPassword:`${process.env.EMAIL_PASSWORD}`
}