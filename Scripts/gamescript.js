var categories = ['Unity', 'Chapter Questions', 'Adobe Animate', 'Visual Studio', 'Copyright'];
var questions = [
  ['This is the shortcut for the move tool.', 'This needs to be done before starting the lego micro-game.', 'This is the the shortcut for the scale tool.', 'This is where you interact with the game being built.', 'This is the button that allows you to change your camera orientation.', 'This is the the shortcut for the select tool.'],
  ['This person creates the controls for the player.', 'This generation is when home video game systems became popular.', 'This person creates character depth and interaction.', "This perspective has you looking through the character's eyes.", 'This person creates the visual elements and assets of the game.', 'This is the thing that makes a product different from the competion. '],
  ['This is the shortcut for undo.', 'This the button to insert a keyframe. ', 'This the button to make a symbol.', 'This is the shortcut to group things together.', 'This is the shortcut for the scale tool.', "This was used to make Alfonso's tail."],
  ['This is what you need to keep in mind when typing.', 'This is what you end a line of code with.', 'This is the way to print in C#.', 'This is used to ignore a line of code.', 'This is how you check if your code works.', 'This the button that is pushed to auto complete part of a line of code.'],
  ['This is the symbol for copyright.', 'This allows for complete use of the work without any extra steps needed.', 'This requires you to share a work with the same liscenses attached.', 'This makes you unable to edit the work under this .', 'This prevents you from using the work for profit.', 'This requires you to give credit.']];
var answers = [
  ['What is W?', 'What is verify your age?', 'What is T?', 'What is the scene view?', 'What is alt?', 'What is V?'],
  ['Who is the user interface designer?', 'What is Generation 2?', 'Who is the game writer?', 'What is first person perspective?', 'Who is the art designer?', 'What is the unique selling pont?'],
  ['What is ctrl+z?', 'What is f6?', 'What is f8?', 'What is ctrl+g?', 'What is V?', 'What is a brush?'],
  ['What is case sensitive?', 'What is ;?', 'What is Console.WriteLine()?', 'What is //?', 'What is debug?', 'What is enter?'],
  ['What is ©?', 'What is public domain?', 'What is share alike?', 'What is no derivatives?', 'What is non-commercial?', 'What is attribution?']];

var url = document.location.href,
  params = url.split('?')[1].split('&'),
  data = {}, tmp;
for (var i = 0, l = params.length; i < l; i++) {
  tmp = params[i].split('=');
  data[tmp[0]] = tmp[1];
}
var numTeams = parseInt(data.teams);
var teams = new Array();
for (i = 1; i <= numTeams; i++) {
  teams[i] = ['Team ' + i, 0];
}
teams = teams.filter(function () { return true });
var currentTeam = 0;
var previousTeam = 0;
var questionsLeft = categories.length * questions[0].length;
var isAnsReveal = false;
var isPlaying = true;
var isHint = true;
var isBtns = true;
var currentQuestion;

var dd = getRandomInt(2, 30-numTeams);
var maxBet = 0;
var ddCategory;
var ddQuestionID;

var money = '';

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function setupBoard() {
  for (var i = 0; i < categories.length; i++) {
    var col = document.createElement('div');
    col.className = 'col-sm text-center';
    var card = document.createElement('div');
    card.className = 'card';

    var cardHeader = document.createElement('div');
    cardHeader.className = 'card-header';
    var header = document.createElement('h2');
    var headerText = document.createTextNode(categories[i]);
    header.appendChild(headerText);

    var list = document.createElement('ul');
    list.className = 'list-group list-group-flush';
    for (var j = 0; j < questions[i].length; j++) {
      var link = document.createElement('a');
      link.setAttribute('href', '');
      link.setAttribute('data-toggle', 'modal');
      link.setAttribute('data-target', '#questionModal');
      link.setAttribute('data-category', i.toString())
      link.setAttribute('data-money', ((j + 1) * 200).toString());
      link.setAttribute('data-questionid', j.toString());
      var listItem = document.createElement('li');
      listItem.className = 'list-group-item';
      var amount = document.createTextNode('$' + (j + 1) * 200);
      listItem.appendChild(amount);

      list.append(link);
      link.append(listItem);
    }

    $('#gameBoard').append(col);
    col.append(card);
    card.append(cardHeader);
    cardHeader.append(header);
    card.append(list);
  }
}

function setupScoreBoard() {
  $('#scoreboard-header').empty();
  $('#scoreboard-data').empty();
  for (var i = 1; i <= numTeams; i++) {
    var h = "<th>Team " + i + "</th>";
    if (i == 1) {
      var d = '<td class="s-table-text-active" id="t' + i + '">$0</td>';
    } else {
      var d = '<td id="t' + i + '">$0</td>';
    }
    $('#scoreboard-header').append(h);
    $('#scoreboard-data').append(d);
  }
}

function incrementTeam() {
  previousTeam = currentTeam;
  if (currentTeam < teams.length - 1) {
    currentTeam++;
  } else {
    currentTeam = 0;
  }
}

function reduceQuestions() {
  questionsLeft--;
}

function checkForWinner() {
  if (questionsLeft == 0) {
    var url = "result.html?teams=" + encodeURIComponent(numTeams);
    for (i = 0; i < numTeams; i++) {
      url += "&team" + (i + 1) + "=" + encodeURIComponent(teams[i][1]);
    }
    document.location.href = url;
  }
}

function whosTurnIsIt() {
  $('#teamTurn').text(teams[currentTeam][0] + ' is up');
}

function updateScoreboard() {
  $('#t' + (currentTeam + 1)).empty();
  d = '$' + teams[currentTeam][1];
  $('#t' + (currentTeam + 1)).append(d);
}

function updateActiveTeam() {
  document.getElementById("t" + (currentTeam + 1)).classList.add('s-table-text-active');
  document.getElementById("t" + (previousTeam + 1)).classList.remove('s-table-text-active');
}

function controlAudio(b) {
  document.getElementById('background_audio').muted = b;
}

function nextQuestion() {
  $('#questionModal').modal('hide');
  currentQuestion.addClass('isDisabled');
  currentQuestion.children().addClass('disabled');
  isAnsReveal = false;
  updateScoreboard();
  incrementTeam();
  whosTurnIsIt();
  updateActiveTeam();
  checkForWinner();
}

function hintCheck() {
  if (questionsLeft == (parseInt(categories.length * questions[0].length) - 5)) {
    document.getElementById("reveal").innerHTML = "Reveal Answer";
    document.getElementById("incorrect").innerHTML = "Incorrect";
    document.getElementById("correct").innerHTML = "Correct";
    isHint = false;
  }
}

function hideButtons(){
  var btns = ["reveal", "correct", "incorrect"];
  for (i = 0; i < btns.length; i++) {
      document.getElementById(btns[i]).classList.add("hidden");
      document.getElementById(btns[i]).style.height = "0%";
      document.getElementById(btns[i]).innerHTML = "";
    }
    document.getElementById("modal-footer").classList.remove("modal-footer");
    document.getElementById("toggleBtns").innerHTML = "Turn on Buttons";
}

function showButtons(){
  var btns = ["reveal", "correct", "incorrect"];
  for (i = 0; i < btns.length; i++) {
      document.getElementById(btns[i]).classList.remove("hidden");
      document.getElementById(btns[i]).style.height = "100%";
    }
    if (isAnsReveal == false) {
      if (isHint) {
        document.getElementById("reveal").innerHTML = "Reveal Question (space)";
      } else {
        document.getElementById("reveal").innerHTML = "Reveal Question";
      }
    }
    if (isHint) {
      document.getElementById("correct").innerHTML = "Correct (c)";
      document.getElementById("incorrect").innerHTML = "Incorrect (z)";
    }else{
      document.getElementById("correct").innerHTML = "Correct";
      document.getElementById("incorrect").innerHTML = "Incorrect";
    }
    document.getElementById("modal-footer").classList.add("modal-footer");
    document.getElementById("toggleBtns").innerHTML = "Turn off Buttons";
}

function dailyDouble(category, questionid){
  var modal = $("#questionModal")
  modal.find('.modal-title').text("Daily Double!");
  modal.find('.modal-body p').text("Place your bets!");

  var bet = document.createElement("input");
  bet.setAttribute("type", "number");
  bet.setAttribute("name", "bet");
  bet.setAttribute("min", "5");
  bet.setAttribute("step", "1");
  bet.setAttribute("pattern", "\d*");
  bet.setAttribute("placeholder", "Enter Bet");
  bet.setAttribute("id", "bet-input");
  bet.classList.add("bet-input");

  var ptext = document.createElement("p");
  maxBet = teams[currentTeam][1];
  if (maxBet <= 5){
    maxBet = 500;
  }
  ptext.innerHTML = "Minimum is $5, maximum is $" + maxBet + ".";
  ptext.classList.add("modal-dd-text");

  var ddbtn = document.createElement("button");
  ddbtn.innerHTML = "Confirm";
  ddbtn.classList.add("ddbtn");
  ddbtn.setAttribute("id","ddbtn");
  ddbtn.setAttribute("onClick", "ddbtn()")

  document.getElementById("daily-double").appendChild(ptext);
  document.getElementById("daily-double").appendChild(bet);
  document.getElementById("daily-double").appendChild(document.createElement("br"));
  document.getElementById("daily-double").appendChild(ddbtn);
  if (isBtns){
    hideButtons();
  }

  ddCategory = category;
  ddQuestionID = questionid;
}

function setInputFilter(textbox, inputFilter) {
  ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
    textbox.addEventListener(event, function() {
      if (inputFilter(this.value)) {
        this.oldValue = this.value;
        this.oldSelectionStart = this.selectionStart;
        this.oldSelectionEnd = this.selectionEnd;
      } else if (this.hasOwnProperty("oldValue")) {
        this.value = this.oldValue;
        this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
      } else {
        this.value = "";
      }
    });
  });
}

function ddbtn(){
  var input = document.getElementById("bet-input").value;
  input = input.split(".")[0];
  if (!input.includes("-") && input >= 5 && input <= maxBet){
    if (isBtns){
      showButtons();
    }
    money = input;
    var modal = document.getElementById('questionModal');
    document.getElementById('questionModalLabel').innerHTML = (categories[ddCategory] + ' for $' + money);
    document.getElementsByClassName('card-text')[0].innerHTML = (questions[ddCategory][ddQuestionID]);
    var ddOptions = document.getElementById("daily-double");
    ddOptions.parentNode.removeChild(ddOptions);
    document.getElementById("questionModal").focus();
  }
}


$(document).ready(function () {
  var category = '';
  var questionid = '';

  setupBoard();
  setupScoreBoard();
  whosTurnIsIt();


  $('a').click(function () {
    currentQuestion = $(this);
    reduceQuestions();
    hintCheck();
  });

  $('#questionModal').on('shown.bs.modal', function (event) {
    var link = $(event.relatedTarget);
    category = link.data('category');
    money = link.data('money');
    questionid = link.data('questionid');
    var modal = $(this);
    if (questionsLeft == dd){
      dailyDouble(category, questionid);
    }else{
      modal.find('.modal-title').text(categories[category] + ' for $' + money);
      modal.find('.modal-body p').text(questions[category][questionid]);
    }
  });

  document.getElementById("questionModal").addEventListener('keydown', function (event) {
    if (event.keyCode == 32) { // spacebar
      event.preventDefault();
      document.getElementById("reveal").click();
    }
    else if (event.keyCode == 90) { // z
      event.preventDefault();
      document.getElementById("incorrect").click();
    }
    else if (event.keyCode == 67) { // c
      event.preventDefault();
      document.getElementById("correct").click();
    }
  });

  $('#reveal').click(function () {
    var modal = $(this);
    if (isAnsReveal == false) {
      $('#questionModal').find('.modal-body p').text(answers[category][questionid]);
      if (isHint) {
        document.getElementById("reveal").innerHTML = "Reveal Question (space)";
      } else {
        document.getElementById("reveal").innerHTML = "Reveal Question";
      }
      isAnsReveal = true;
      return;
    }
    $('#questionModal').find('.modal-body p').text(questions[category][questionid]);
    isAnsReveal = false;
    if (isHint) {
      document.getElementById("reveal").innerHTML = "Reveal Answer (space)";
    } else {
      document.getElementById("reveal").innerHTML = "Reveal Answer";
    }
  });

  $('#correct').click(function () {
    teams[currentTeam][1] += parseInt(money);
    nextQuestion();
  });

  $('#incorrect').click(function () {
    teams[currentTeam][1] -= parseInt(money);
    nextQuestion();
  });

  $('#close').click(function () {
    
  })
});

$('#audioControl').click(function () {
  if (!isPlaying) {
    document.getElementById("audioControl").innerHTML = "Unmute Music";
  } else {
    document.getElementById("audioControl").innerHTML = "Mute Music";
  }
  isPlaying = !isPlaying;
  controlAudio(isPlaying);
})

$('#toggleBtns').click(function () {
  if (isBtns) {
    hideButtons();
    isBtns = false;
  } else {
    showButtons();
    isBtns = true;
  }
})