//file for handling html routes 
//note: use raw:true when json data needed (such as when rendering html)

const express = require("express");
const router = express.Router();
const db = require("../models")

//home page is login
router.get("/",(req,res)=> {
    res.render("login"); 
})

//login page 
router.get("/login",(req,res)=> {
    res.render("login"); 
})

//signup page
router.get("/signup",(req,res)=> {
    res.render("login"); 
})

//only logged in users should see the profile page; otherwise, they are redirected to the create acc page 
router.get("/profile",(req,res)=>{
  // db.Users.findOne({
  //   where: {
  //     username: req.session.use
  //   }
  // })
  console.log("\n\n\n" + req.session.user + "\n\n\n")
  db.TournamentBracket.findAll({
    where: {
      UserId: req.session.user.id
    }
  }).then(dbBracket=>{
    const hbsObj= {
      user:req.session.user,
      brackets: dbBracket
    }; 
    console.log(hbsObj);
    res.render("profile",hbsObj)
  }) 
  // if(req.session.user) {
      //res.render("profile",) 
  // } else {
  //     res.render("login"); 
  // }
})


//all tournaments
router.get("/allbrackets",(req,res)=>{
  db.TournamentBracket.findAll({
    include:[db.Option]
  }).then(dbBrackets=>{
    const jsonbrackets = dbBrackets.map(function(bracket) {
      return bracket.toJSON(); 
    })
    const hbsObj= {brackets:jsonbrackets}; 
    console.log(hbsObj);
    res.render("allbrackets",hbsObj)
  }) 
})

//only logged in users should see the profile page; otherwise, they are redirected to the create acc page 
//new bracket page 
router.get("/newbracket",(req,res)=>{
    // if(req.session.user) {
        res.render("newbracket"); 
    // } else {
    //     res.render("login"); 
    // }
})

//specific bracket 
router.get("/brackets/:id",(req,res)=>{
    db.TournamentBracket.findOne({
        where:{
        id:req.params.id
    },include:[db.MatchUp,db.Option]
    }).then(dbBracket=>{
    console.log(dbBracket)
    res.render("bracket",{...dbBracket.dataValues})
  }).catch(err=> res.json('NO TOURNAMENTS BY THAT ID'))
})


module.exports = router;