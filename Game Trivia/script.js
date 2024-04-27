var questionIndex = 0;
var questions = [];
var score = 0;

var startButton = document.getElementById("start-button");
var questionElement = document.getElementById("question");
var choicesElement = document.getElementById("choices");
var triviacontainer = document.getElementById("Trivia-container");

function fetchQuestions() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://opentdb.com/api.php?amount=10&category=15&difficulty=easy", true);
  xhr.onload = function () {
    if (xhr.status === 200) {
      var response = JSON.parse(xhr.responseText);
      
        questions = response.results;
        startButton.onclick = function () {
          startButton.style.display = "none";
          displayQuestion();
        };
      
    } else {
      displayErrorMessage("Apologies! couldn't retrieve the questions at the moment. Please refresh the page and try again.");
    }
  };
  xhr.onerror = function () {
    displayErrorMessage("It seems there's a problem with your internet connection. Please ensure you are connected and try again.");
  };
  xhr.send();
}

function displayErrorMessage(message) {
  var errorElement = document.createElement("p");
  errorElement.innerHTML = message;
  errorElement.style.color = "red";
  triviacontainer.appendChild(errorElement);
}

var nextButton = document.createElement("button");
nextButton.id = "next-button";
nextButton.innerHTML = "Next Question";
nextButton.onclick = nextQuestion;
nextButton.style.display = "none";
triviacontainer.appendChild(nextButton);

function nextQuestion() {
  questionIndex++;
  choicesElement.innerHTML = "";

  if (questionIndex < questions.length) {
    displayQuestion();
  } else {
    showScore();
  }
}

function displayQuestion() {
  questionElement.innerHTML = "";
  choicesElement.innerHTML = "";

  var question = questions[questionIndex];

  questionElement.innerHTML = questionIndex+1 +". "+question.question;

  var choices = question.incorrect_answers.concat(question.correct_answer);
  choices = choices.sort(function () {
    return 0.5 - Math.random();
  });

  choices.forEach(function (choice) {
    var li = document.createElement("li");
    var button = document.createElement("button");
    button.innerHTML = choice;
    button.onclick = checkAnswer;
    li.appendChild(button);
    choicesElement.appendChild(li);
  });

  nextButton.style.display = "none";
}

function checkAnswer(e) {
  var selectedChoice = e.target.innerHTML;
  var question = questions[questionIndex];

  var feedbackElement = document.createElement("p");
  feedbackElement.style.marginTop = "10px";

  var buttons = choicesElement.getElementsByTagName("button");
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].disabled = true;
  }

  if (selectedChoice === question.correct_answer) {
    score++;
    feedbackElement.innerHTML = "Correct!";
    feedbackElement.style.color = "green";
  } else {
    feedbackElement.innerHTML = "Incorrect! The correct answer is: " + question.correct_answer;
    feedbackElement.style.color = "red";
  }

  choicesElement.appendChild(feedbackElement);
  triviacontainer.appendChild(nextButton);
  nextButton.style.display = "block";
}

function showScore() {
  triviacontainer.innerHTML = "";

  var scoreElement = document.createElement("h2");
  scoreElement.innerHTML = "You Scored: " + score + " out of 10";
  scoreElement.style.color = "#f5f5f5";

  triviacontainer.appendChild(scoreElement);

  var playAgainButton = document.createElement("button");
  playAgainButton.id = "play-again-button";
  playAgainButton.innerHTML = "Play Again";
  playAgainButton.onclick = function () {
    location.reload();
  };
  triviacontainer.appendChild(playAgainButton);
}

fetchQuestions();