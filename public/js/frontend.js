$('.message a').click(function() {
    $('form').animate({ height: "toggle", opacity: "toggle" }, "slow");
});


var loadFile = function(event) {
    var image = document.getElementById('output');
    image.src = URL.createObjectURL(event.target.files[0]);
};

//frontend javascript to make ajax calls 
$(function () {
    //new user front end
    $("#create-acc").on("click", function (event) {
        event.preventDefault();
        let newUser = {
            username: $("#create-name").val(),
            password: $("#create-password").val(),
        }
        console.log(newUser)
        $.ajax({
            method: "POST",
            data: newUser,
            url: "/signup"
        }).then(function () {
            //after signup, log user in 
            $.ajax({
                method: "POST",
                data: newUser,
                url: "/login"
            }).then(function () {
                //redirect to profile page 
                location.href = "/profile";
            })
            
        })
    })

    //login button
    $("#login-acc").on("click", function (event) {
        event.preventDefault();
        let user = {
            username: $("#login-name").val(),
            password: $("#login-password").val(),
        }
        console.log(user)
        $.ajax({
            method: "POST",
            data: user,
            url: "/login"
        }).then(function () {
            location.href = "/profile";
        })
    })

    //new bracket
    $(".submit-btn").on("click", function (event) {
        event.preventDefault();
        optionsArry = [];
        option_one = $("#option_one").val().trim();
        option_two = $("#option_two").val().trim();
        option_three = $("#option_three").val().trim();
        option_four = $("#option_four").val().trim();
        option_five = $("#option_five").val().trim();
        option_six = $("#option_six").val().trim();
        option_seven = $("#option_seven").val().trim();
        option_eight = $("#option_eight").val().trim();

        optionsArry.push(option_one, option_two, option_three, option_four, option_five, option_six, option_seven, option_eight);

        console.log(optionsArry)

        let newBracket = {
            name: $("#bracket_name").val().trim(),
            options: optionsArry
        }
        $.ajax({
            method: "POST",
            data: newBracket,
            url: "api/tournamentbracket/new"
        }).then(function (res) {
            location.href = "/brackets/" + res.id; 
        })
    })

    $(".vote").on("click", function (event) {
        let votingFor = $(this).data("option")
        let notVotingFor;
        

        if(votingFor === 1){
           notVotingFor = 2
        }else{
            notVotingFor = 1
        }

        let votes= {
            votingFor: votingFor,
            notVotingFor: notVotingFor
        }

        console.log(votingFor)
        console.log(notVotingFor)

        $.ajax({
            method: "PUT",
            data: votes,
            url: "/vote/" + id
        }).then(function () {
            console.log("hello")
        })
    })

    //update round/ advance round
    $(".end-rd").on("click", function (event) {
        let nextRound = $(this).data("rd")
        console.log(nextRound)

        $.ajax({
            method: "PUT",
            data: nextRound,
            url: "/nextround/" + id
        }).then(function () {
            console.log("hello")
        })
    })

    //close bracket
    $(".close-btn").on("click", function (event) {
        let finalWinner = $("#winner").text()
        console.log(finalWinner)

        $.ajax({
            method: "PUT",
            data: finalWinner,
            url: "/close/" + id
        }).then(function () {
            console.log("hello")
        })
    })

    
})