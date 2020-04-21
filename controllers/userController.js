const express = require("express");
const router = express.Router();
const db = require("../models")


//create new user
router.post("/new",(req,res)=> {
    db.User.create({
        user_name:req.body.user_name,
        password:req.body.password,
        email: req.body.email
    }).then(newDbUser=>{
        res.status(200).json(newDbUser);
    })
}); 

module.exports = router;