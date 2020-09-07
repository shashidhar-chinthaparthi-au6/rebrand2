const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    item : {
        type:mongoose.Schema.Types.ObjectId , 
        ref : "Item",
        required: true
    },
    userid : {
        type:mongoose.Schema.Types.ObjectId , 
        ref : "User",
        required: true        
    },
    quantity :{
        type: Number,
        default : 1
    } ,
    address:{
        type:String,
        required : true
    }
});

module.exports = mongoose.model('Order', orderSchema);