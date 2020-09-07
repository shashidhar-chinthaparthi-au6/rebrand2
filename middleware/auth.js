const jwt = require('jsonwebtoken');
const User = require('../models/user.js');

module.exports = async(req, res, next) => {
    // try {
        const token = req.headers.authorization.split(" ")[1];
        const user =await  User.findOne({token: token})
        // console.log(user)
        if(user){
            console.log(user)
            req.user = user;
            next();
        }
        else{
            return res.send({message: "Your are not a Authorized Person"})
        }
        // const decoded = jwt.verify(token, process.env.JWT_KEY || "secret");
        // req.userData = decoded;
        // next();
    // } catch (error) {
    //     return res.status(401).json({
    //         message: 'Auth failed'
    //     });
    // }
};