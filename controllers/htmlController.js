//file for handling html routes 
//note: use raw:true when json data needed (such as when rendering html)

const express = require("express");
const router = express.Router();
const db = require("../models")


router.get("/",(req,res)=>{
  console.log(req.session.user)
  if(req.session.user) {
      res.render("secret",req.session.user) 
  } else {
      res.render("login"); 
  }
})





router.get("/all",(req,res)=>{
  db.TournamentBracket.findAll({
    raw:true
  }).then(dbBrackets=>{
const hbsObj={
  brackets:dbBrackets
}
console.log(hbsObj);
res.render("allbrackets",hbsObj)
  })
   
})


// a route for the bracket

router.get("/new",(req,res)=>{
  res.render("newbracket");
})


router.get("/brackets/:id",(req,res)=>{

  db.TournamentBracket.findOne({
where:{
  id:req.params.id
}
  }).then(dbBracket=>{
    console.log(dbBracket)
    res.render("bracket",{...dbBracket.dataValues})
  }).catch(err=> res.json('NO TOURNAMENTS BY THAT ID'))
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