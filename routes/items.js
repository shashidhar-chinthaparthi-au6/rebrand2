const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const auth = require("../middleware/auth")

const Item = require("../models/item")

router.get("/", (req,res,next) => {
   Item.find().select("name price _id").exec().then(docs => {
       const response = {
           count :docs.length,
           items : docs.map(doc => {
               return {
                   name : doc.name,
                   price : doc.price,
                   _id : doc._id
               }
           })
       }
       
       res.status(200).json(response)
   })
   .catch(err => {
       console.log(err)
       res.status(500).json({
           error : err
       })
   })
})
 

router.post("/", auth, async  (req,res,next) => {
    var itemslist = []
   req.body.map( async (itemsList) => {
        const item = new Item({
            _id:new mongoose.Types.ObjectId(),
            name : itemsList.name,
            price: itemsList.price        
        })
        const itemResult = await item.save()
        console.log(itemResult)
        itemslist.push(itemResult)
    })

    setTimeout(() => {
       res.send({
           message: "Items Addes SuccessFully!!!!",
           itemlist: itemslist
       })
    }, 2000)
      
})

router.get("/:itemId",auth,(req,res,next) => {
    const id = req.params.itemId;
    Item.findById(id)
    .select("name price _id")
    .exec()
    .then(doc => {
        console.log("from database ",doc)
        if(doc){
            res.status(200).json({
                item : doc
            })
        } else {
            res.status(404).json({message:"No valid property entered id "})
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({error : err})
    })
})

router.patch("/:itemId",auth,(req,res,next) => {
    const id = req.params.itemId
    const updateOps = {}
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value
    }
    Item.update({_id:id},{$set:updateOps}).exec().then( result => {
        res.status(200).json({
            message:"Item is  updated"
        })
    }).catch(err => {
        console.log(err)
        res.status(500).json({
            error : err
        })
    })
})


router.delete("/:itemId",(req,res,next) => {
    const id = req.params.itemId
    Item.remove({_id:id}).exec().then(result => {
        res.status(200).json({
            message:"Item is Deleted"
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error : err
        })
    })
})
module.exports = router

