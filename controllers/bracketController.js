const express = require("express");
const router = express.Router();
const db = require("../models")


//create new bracket
// route: /api/tournamentbracket/new
router.post("/new",(req,res)=> {
    //create the database 
    db.TournamentBracket.create({
        name: req.body.name,
        current_round: 1, 
        UserId: req.session.user.id, 
        is_complete: false,
        winner: null 

    }).then(newDbTournamentBracket=>{
        res.status(200).json(newDbTournamentBracket);
        const tournamentID = newDbTournamentBracket.id;
        //array of options passed from the front end 
        const options = req.body.options; 
        //number of users options - for now, hardcoded as 8 
         
        //create each option 
        db.Option.create(options,
            {
                TournamentId: tournamentID            
            }).then(function (newDbOption) {
            res.json(newDbOption); 
        }); 
    }).catch(function(err) {
        console.log(err); 
        res.sendStatus(200); 
    })
}); 

//get a specific bracket by ID
// route: /api/tournamentbracket/:id
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

// route: /api/tournamentbracket/:id
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

// route: /api/tournamentbracket/:id
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


