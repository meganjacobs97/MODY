const express = require("express");
const router = express.Router();
const db = require("../models")
const sequelize = require("sequelize"); 


//create new bracket
// route: /api/tournamentbracket/new
router.post("/new",(req,res)=> {
    //create the database 
    console.log('body', req.body)

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
        const {options} = req.body; 
        //number of users options - for now, hardcoded as 8 
        
        //create each option 
        for(let i = 0; i < options.length; i++) {
            db.Option.create({
                TournamentBracketId: tournamentID,
                name: options[i]
                

            }).then(function (newDbOption) {
                
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
    db.TournamentBracket.findOne({
        where:{
            id:req.params.id
        },
        
        include:[
            {
                model: db.MatchUp,
                where: {
                    round: nextRound-1
                }
            },db.Option]
    }).then(dbTournamentBracket=>{
        const matchUps = dbTournamentBracket.MatchUps; 
        const winners = []; 
        let lastBracket = 0; 
        //loop through each matchup, find and assign winner 
        for(let i = 0; i < matchUps.length; i++) {
            let roundWinner = null;  
            if(matchUps[i].option1_votes > matchUps[i].option2_votes) {
                roundWinner = matchUps[i].option1;
            }
            else if(matchUps[i].option1_votes < matchUps[i].option2_votes) {
                roundWinner = matchUps[i].option2;
            }
            //tie event 
            else {
                const rand = Math.random(); 
                if(rand === 0) {
                    roundWinner = matchUps[i].option1;
                }
                else {
                    roundWinner = matchUps[i].option2;
                }
            }
            //add winners to an array 
            winners.push(roundWinner); 
            //store last bracket number 
            lastBracket = matchUps[i].bracket; 
            //update matchup query (add winner)
            db.MatchUp.update({
                winner: roundWinner
            },{
                where:{
                    id: matchUps[i].id
                }
            }).then(updatedMatchUp=>{
                
            }); 
            
        }
        //create next matchups
        let bracketNum = lastBracket; 
        for(let i = 0; i < winners.length; i+=2) {
            bracketNum++; 
            db.MatchUp.create({
                TournamentBracketId: req.params.id,
                round: nextRound,
                bracket: bracketNum,
                option1: winners[i],
                option2: winners[i+1], 
                option1_votes: 0, 
                option2_votes: 0
            }).then(function (newDbMatchup) {
                
            })
        }
        res.status(200); 
    })  

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
    
    db.MatchUp.findOne({
        where:{
            TournamentBracketId:req.params.id,
            [sequelize.Op.or]: [{option1: votingFor,option2:notVotingFor},{option1:notVotingFor,option2:votingFor}]
        }
    }).then(dbFoundMatchUp=>{
        let option1Votes = dbFoundMatchUp.option1_votes; 
        let option2Votes = dbFoundMatchUp.option2_votes; 
        const option1 = dbFoundMatchUp.option1;
        const option2 = dbFoundMatchUp.option2; 
        db.User.findOne({
            where: {
                id: req.session.user.id
            }
        }).then(dbUser=>{
            //options_voted_for is stored as a string, convert to array of integers
            const allVotedFor = []; 
            if(dbUser.options_voted_for !== null) {
                let allVotedForString = dbUser.options_voted_for.split(";"); 
                for(let i = 0; i < allVotedForString.length; i++) {
                    allVotedFor.push(parseInt(allVotedForString[i]))
                }
            }
            
        
            //query to find option ids for voting for and not voting for options 
            db.Option.findOne({
                where: {
                    TournamentBracketId:req.params.id,
                    name: votingFor 
                }
            }).then(dbOptionVotingFor=> {
                db.Option.findOne({
                    where: {
                        TournamentBracketId:req.params.id,
                        name: notVotingFor
                    }
                }).then(dbOptionNotVotingFor=> {
        
                    //loop through options 
                    let votingString = ""; 
                    let oldIndex = 0; 
                    
                
                    for(let i = 0; i < allVotedFor.length; i++) {
                        //if user voted for and is trying to vote again 
                        if(dbOptionVotingFor.id === allVotedFor[i]) {

                            votingString = "votingagain"
                        }
                        //if user voted for other option 
                        else if(dbOptionNotVotingFor.id === allVotedFor[i]) {
                            votingString = "votingchange"
                            oldIndex = i;
                        }
                        
                    }
                    //put outside loop in case user has never voted on anything before 
                    if(votingString === "") {
                        votingString = "votingfirst"
                    }
                    
                    //if already voted for, and trying to vote for again, do nothing 
                    //if already voted for, and trying to vote for the other option 
                    if(votingString === "votingchange") {
                        //decrease votes for that option and increase votes for other option 
                        if(option1 === votingFor) {
                            option1Votes++; 
                            option2Votes--; 
                        }
                        else {
                            option2Votes++; 
                            option1Votes--; 
                        }

                        //remove old option from array, add new 
                        allVotedFor.splice(oldIndex,1); 
                        allVotedFor.push(dbOptionVotingFor.id); 

                    }     
                    //if not voted for, and trying to vote 
                    else if(votingString === "votingfirst") {
                        //increase vote (update query)
                        if(option1 === votingFor) {
                            option1Votes++; 
                        }
                        else {
                            option2Votes++;  
                        }
                        allVotedFor.push(dbOptionVotingFor.id)
                    }
                    
                    
                    if(votingString !== "votingagain") {
                        //update matchup to reflect vote change  
                        db.MatchUp.update({
                            option1_votes: option1Votes, 
                            option2_votes: option2Votes
                        },{
                            where:{
                                TournamentBracketId:req.params.id,
                                [sequelize.Op.or]: [{option1: votingFor,option2:notVotingFor},{option1:notVotingFor,option2:votingFor}]
                            }   
                        }).then(dbMatchUp=>{
                        
                        }); 
                        //update user to reflect change 
                        db.User.update({
                            //trun back into a string
                            options_voted_for: allVotedFor.join(";") 
                        },{
                            where:{
                                id: req.session.user.id
                            }  
                        }).then(dbUserRes=> {
                            res.status(200).send("vote updated"); 
                        });
                
                    } else {
                        res.send("vote not updated"); 
                    }
                    
                })  
            }); 
        })
    })          
});

// route: /api/tournamentbracket/close/:id
//update a bracket to close
router.route("/close/:id").put((req,res)=>{
    //query for tournament including matchups 
    db.TournamentBracket.findOne({
        where:{
            id:req.params.id
        },
        
        include:[db.MatchUp,db.Option]
    }).then(dbTournamentBracket=>{
        //get winner from last matchup (will be at the last index)
        const matchUps = dbTournamentBracket.MatchUps; 
        const lastMatchUp = matchUps[matchUps.length - 1]; 
        let roundWinner = null; 

        if(lastMatchUp.option1_votes > lastMatchUp.option2_votes) {
            roundWinner = lastMatchUp.option1;
        }
        else if(lastMatchUp.option1_votes < lastMatchUp.option2_votes) {
            roundWinner = lastMatchUp.option2;
        }
        //tie event 
        else {
            const rand = Math.random(); 
            if(rand === 0) {
                roundWinner = lastMatchUp.option1;
            }
            else {
                roundWinner = lastMatchUp.option2;
            }
        }
        //update matchup query (add winner)
        db.MatchUp.update({
            winner: roundWinner
        },{
            where:{
                id: lastMatchUp.id
            }
        }).then(updatedMatchUp=>{
            //update tournamnet
            db.TournamentBracket.update({
                current_round: 0, 
                is_complete: true,
                winner: roundWinner
            },{
                where:{
                    id:req.params.id
                }
            }).then(updatedDbTournamentBracket=>{
                res.status(200).json(updatedDbTournamentBracket);
            })
        }); 
    }); 
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


