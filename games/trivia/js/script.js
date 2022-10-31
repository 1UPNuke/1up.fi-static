'use strict';
const rootURL = "https://opentdb.com/";
var token = null;
//###   ENABLE THIS ONCE YOU'RE DONE TESTING   ###//
/*$.ajax({
    url: rootURL+"api_token.php?command=request",
    type: "GET",
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function(result) {
        token = result.token;
    },
    error : function(jqXHR, textStatus, errorThrown) {
        console.error("Getting token failed: ", jqXHR. textStatus, errorThrown)
        token = null;
    },
    timeout: 120000,
});*/
var correctAns;
var answering = false;
var first = true;
var score = 0;
var categoryID = "";
var health = 5;
var heartElement = "";

$(document).ready(function(){
    getCategories();
    heartElement = $("#hearts").html();
    updateHearts();
});

function handleButton()
{
    if(health<=0)
    {
        location.reload();
        return;
    }
    if(first)
    {
        categoryID = $("#categories").val();
        $("#categories")[0].outerHTML = `<div id="categories" value="${$("#categories").val()}"><input value="${$("#categories option:selected").text()}" readonly>`;
        first = false;
    }
    if(answering)
    {
        if(correctAns == document.forms["triviaForm"]["ans"].value)
        {
            $("#result").text("Correct!");
            $("#result").css("color", "green");
            score++;
            $("#score").text("Score: " + score);
        }
        else
        {
            $("#result").text("Wrong! Correct answer was: " + correctAns);
            $("#result").css("color", "red");
            health--;
            updateHearts();
        }
        $("#ansBtn").html("Next Question");
        answering = false;
    }
    else
    {
        $("#ansBtn").prop('disabled', true);
        $("#ansBtn").html("Answer");
        $("#result").text("");
        getQuestion();
        answering = true;
    }
    if(health<=0)
    {
        $("#ansBtn").prop('disabled', false);
        $("#ansBtn").html("Try again?");
        $("#result").text("You lost!");
    }
}

function getQuestion()
{
    let params = "?amount=1&type=multiple";
    if(categoryID != "all")
    {
        params += "&category="+categoryID;
    }
    if(token)
    {
        params += "&token="+token;
    }
    request({
        url: rootURL+"api.php"+params,
        success: function(result) {
            let q = result.results[0];
            correctAns = q.correct_answer;
            let answers = shuffle([q.correct_answer, ...q.incorrect_answers]);
            $("#question").html(q.question);
            $("#answers").html("");
            for(let i=0; i<answers.length; i++)
            {
                $("#answers").append(`<input onchange="ansChange();" type="radio" id="ans${i}" name="ans" value="${answers[i]}"><label for="ans${i}">${answers[i]}</label><br>`)
            }
        },
    });
}

function getCategories()
{
    request({
        url: rootURL+"api_category.php",
        success: function(result) {
            let categoryList = $("#categories");
            for(let category of result.trivia_categories)
            {
                categoryList.append(`<option value="${category.id}">${clean(category.name)}</option>`)
            }
        }
    });
}

function updateHearts()
{
    $("#hearts").html("");
    for(let i=0; i<health; i++)
    {
        $("#hearts").append(heartElement);
    }
}

function ansChange(){
    $("#ansBtn").prop('disabled', false);
}

function clean(category){
    return category.replace("Entertainment: ", "").replace("Science: ", "");
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function request(config)
{
    $.ajax({
        url: config.url || rootURL+"api.php",
        type: "GET",
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: config.success,
        timeout: 120000,
    });
}
     contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: config.success,
        timeout: 120000,
    });
}

    });
}