//frontend javascript to make ajax calls 

// console.log("hi")

$(function () {
    //new user front end
    $(".create").on("click", function (event) {
        event.preventDefault();
        let newUser = {
            username: $(".name").val(),
            password: $(".password").val(),
        }

        console.log(newUser)
        $.ajax({
            method: "POST",
            data: newUser,
            url: "/signup"
        }).then(function () {
            console.log("hello")
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
            url: "/new"
        }).then(function () {
            console.log("hello")
        })
    })

    $(".vote").on("click", function (event) {
        let votingFor = $(this).data("option")
        console.log(votingFor)

        $.ajax({
            method: "PUT",
            data: votingFor,
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