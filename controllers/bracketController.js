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
        //res.status(200).json(newDbTournamentBracket);
        const tournamentID = newDbTournamentBracket.id;
        //array of options passed from the front end 
        //TODO - parse correctly; depends on front end 
        const options = (req.body.options).split(","); 
        console.log(options); 
        //number of users options - for now, hardcoded as 8 
        
        //create each option 
        for(let i = 0; i < options.length; i++) {
            db.Option.create({
                TournamentBracketId: tournamentID,
                name: options[i]
                

            }).then(function (newDbOption) {
                console.log(options[i]); 
            }); 
        }

        //create matchups
        let bracketNum = 0; 
        for(let i = 0; i < options.length; i+=2) {
            bracketNum++; 
            db.MatchUp.create({
                TournamentBracketId: tournamentID,
                //start at round 1
                round: 1,
                bracket: bracketNum,
                option1: options[i],
                option2: options[i+1], 
                option1_votes: 0, 
                option2_votes: 0
            }).then(function (newDbMatchup) {
                
            })
            
        }
        res.status(200).send("bracket created");         
            
    }).catch(function(err) {
        console.log(err); 
        res.sendStatus(500); 
    })
}); 

//get a specific bracket by ID
// route: /api/tournamentbracket/:id
router.route("/:id").get((req,res)=>{
    db.TournamentBracket.findOne({
        where:{
            id:req.params.id
        },
        
        include:[db.MatchUp,db.Option]
    }).then(dbTournamentBracket=>{
        res.json(dbTournamentBracket)
    })
});

// route: /api/tournamentbracket/nextround/:id
//update a bracket to advance to the next round 
router.route("/nextround/:id").put((req,res)=>{
    //front end will pass a number indicating the next round number 
    const nextRound = req.body.nextRound; 

    //find query for the tournament, including the matchups 
        //loop through each matchup
            //update matchup query (add winner)
            //add winners to an array 
            //store last bracket number 
        //create matchups query inside loop (like above in the /new post route)

    //update TournamentBracket.current_round to next round 
    db.TournamentBracket.update({
        current_round: nextRound
    },{
        where:{
            id:req.params.id
        }
    }).then(updatedDbTournamentBracket=>{
        res.status(200).json(updatedDbTournamentBracket);
    })
});

// route: /api/tournamentbracket/vote/:id
//update a bracket to change votes 
router.route("/vote/:id").put((req,res)=>{
    const votingFor = req.body.votingFor; 
    const notVotingFor = req.body.notVotingFor; 

    //first query to get current votes 
        //search for a matchup where the tournamentid matches id and the options match 
        //$or: [{a: 5}, {a: 6}]  // (a = 5 OR a = 6)
    
            //check if an option's id matches what the user has voted on 
                //query (find) for option where id matches the tournament and option matches the name 
                    //if already voted for, and trying to vote for again, do nothing 
                    //if already voted for, and trying to vote for the other option 
                        //decrease votes for that option and increase votes for other option (update query)
                        //query user to update voted for 
                            //remove old option from array, add new 
                    //if not voted for, and trying to vote 
                        //increase vote (update query)
                        //query user to update voted for (add new)
                
});

// route: /api/tournamentbracket/close/:id
//update a bracket to close
router.route("/close/:id").put((req,res)=>{
    
    //query for tournament including matchups 
        //get winner from last matchup (will be at the last index)
        //update query for matchup to place winner 

    //inside last then block:
    db.TournamentBracket.update({
        current_round: 0, 
        is_complete: true,
        winner: finalWinner
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


