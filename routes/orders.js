const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const auth = require("../middleware/auth")

const Order = require("../models/order");
const Item = require("../models/item");
const order = require("../models/order");


router.get("/", auth ,(req, res, next) => {
  const userData  =req.user;
  Order.find()
    .then((docs) => {
      var item_ids = [];

      docs.map(orders => {
        if(JSON.stringify(userData._id )==JSON.stringify(orders.userid)){
          item_ids.push({itemid: orders.item, quantity: orders.quantity, address: orders.address})
        }
      })
      console.log(item_ids)
      Item.find()
        .then((items) => {
          var item_list = []
          items.map(itemslist => {
            item_ids.map(ids => {
              if(JSON.stringify(ids.itemid) === JSON.stringify(itemslist._id))
              {
                item_list.push({
                  id: itemslist._id,
                  name: itemslist.name,
                  price: itemslist.price,
                  quantity: ids.quantity,
                  address: ids.address
                } )
              }
            })
            
          })
          res.status(200).json({
          count: item_list.length,
          orders: item_list.map((doc) => {
            console.log(doc)
            return {
              id: doc.id,
              item: doc.name,
              quantity: doc.quantity,
              price: doc.price,
              address: doc.address
            };
          }),
      });
        })
      
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/", auth, (req, res, next) => {
  const userData = req.user;
  Item.findById(req.body.itemId)
    .then(item => {
        if(!item){
            return res.status(404).json({
                message:"Item Not found"
            })
        }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        item: req.body.itemId,
        userid: userData._id,
        address : req.body.address
      });
      return order.save();
    })
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "order successfull",
        createdOrder: {
          _id: result._id,
          item: result.Item,
          userid:userData._id,
          quantity: result.quantity,
          address : result.address

        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/:orderId",auth, (req, res, next) => {
  Item.findById(req.params.orderId)
  .exec()
  .then(order => {
      if(!order){
          return res.status(404).json({
              message:"oreder not found"
          })
      }
      res.status(200).json({
          order : order
      })
  } )
  .catch(err => {
      res.status(500).json({
          error : err
      })
  })
});

router.delete("/:orderId", (req, res, next) => {
 Order.remove({
     _id : req.params.orderId
 }).exec().then(result => {
     res.status(200).json({
         message:"order deleted"
     })
 }).catch()
});

module.exports = router;
