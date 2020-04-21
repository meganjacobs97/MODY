const express = require("express");
const router = express.Router();
const db = require("../models")


//create new bracket
router.post("/new",(req,res)=> {
    db.TournamentBracket.create({
        //TODO
        // user_name:req.body.user_name,
        // password:req.body.password,
        // email: req.body.email
    }).then(newDbTournamentBracket=>{
        res.status(200).json(newDbTournamentBracket);
    })
}); 

//get a specific bracket by ID
router.route("/:id").get((req,res)=>{
    db.TournamentBracket.findOne({
        where:{
            id:req.params.id
        },
        //TODO
        // include:[db.Round,db.Option]
    }).then(dbTournamentBracket=>{
        res.json(dbTournamentBracket)
    })
});

//update a bracket 
router.route("/:id").put((req,res)=>{
    db.TournamentBracket.update({
        //TODO
        // product_name:req.body.product_name,
        // price:req.body.price
    },{
        where:{
            id:req.params.id
        }
    }).then(updatedDbTournamentBracket=>{
        res.status(200).json(updatedDbTournamentBracket);
    })
});

//delete a bracket 
router.route("/:id").delete((req,res)=>{
    db.TournamentBracket.destroy({
        where:{
            id:req.params.id
        }
    }).then(deletedTournamentBracket=>{
        res.status(200).json(deletedTournamentBracket);
    })
})

module.exports = router;


