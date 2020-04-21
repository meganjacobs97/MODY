//file for handling html routes 
//note: use raw:true when json data needed (such as when rendering html)

const express = require("express");
const router = express.Router();
const db = require("../models")

router.get("/",(req,res)=>{
   
})

//this route is protected - can only get there if logged in, otherwise redirected 
// router.get("/secret",function(req,res) {
//     if(req.session.user) {
//         res.render("secret",req.session.user) 
//     } else {
//         res.redirect("/login"); 
//     }
// }); 

module.exports = router;