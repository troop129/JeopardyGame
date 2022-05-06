var categories = ['Unity', 'Chapter Questions', 'Adobe Animate', 'Visual Studio', 'Copyright'];
var questions = [
  ['This is the shortcut for the move tool.', 
  'This needs to be done before starting the LEGO™ micro-game.', 
  'This is the the default shortcut for the scale tool.', 
  'This is where you interact with the game being built.', 
  'This is the button that allows you to change your camera orientation.', 
  'This is the the default shortcut for the select tool.'],
  ['This person creates the controls for the player.', 
  'This generation is when home video game systems became popular.', 
  'This person creates character depth and interaction.', 
  "This perspective has you looking through the character's eyes.", 
  'This person creates the visual elements and assets of the game.', 
  'This is the term for what that makes a product different from the competion.'],
  ['This is the shortcut for undo.', 
  'This the button to insert a keyframe. ', 
  'This the button to make a symbol.', 
  'This is the shortcut to group things together.', 
  'This is the shortcut for the scale tool.', 
  'This was a tool used to make Alfonso\'s tail.'],
  ['This is what you end a line of code with.', 
  'This is what you need to keep in mind when naming and calling variables.', 
  'This is the way to print to the console in C#.', 
  'This is used to comment a line of code in C#.', 
  'This is the process of finding and fixing errors in your code.', 
  'This the button that is pushed to auto complete part of a line of code.'],
  ['This is the symbol for copyright.', 
  'This allows for complete use of the work without any extra steps needed.', 
  'This requires you to share a work with the same licenses attached.', 
  'This prevents you from making changes to the work.', 
  'This prevents you from using the work for profit.', 
  'This requires you to give credit.']];
var answers = [
  ['What is "W"?', 
  'What is verifying your age?', 
  'What is "T"?', 
  'What is the scene view?', 
  'What is "alt"?', 
  'What is "V"?'],
  ['Who is the user interface designer?', 
  'What is Generation 2?', 
  'Who is the game writer?', 
  'What is first person perspective?', 
  'Who is the art designer?', 
  'What is the unique selling pont (USP)?'],
  ['What is "Ctrl+Z"?', 
  'What is "F6"?', 
  'What is "F8"?', 
  'What is "ctrl+g"?', 
  'What is "V"?', 
  'What is a brush?'],
  ['What is capitalization?', 
  'What is ";"?', 
  'What is "Console.WriteLine()"?', 
  'What is "//"?', 
  'What is debugging?', 
  'What is enter (or tab)?'],
  ['What is "©"?', 
  'What is public domain?', 
  'What is share-alike?', 
  'What is non-derivative?', 
  'What is non-commercial?', 
  'What is attribution?']];

var url = document.location.href,
  params = url.split('?')[1].split('&'),
  data = {}, tmp;
for (var i = 0, l = params.length; i < l; i++) {
  tmp = params[i].split('=');
  data[tmp[0]] = tmp[1];
}
var numTeams = parseInt(data.teams);
if (numTeams > 6){
  numTeams = 6;
}
var teams = new Array();
for (i = 1; i <= numTeams; i++) {
  teams[i] = ['Team ' + i, 0];
}
teams = teams.filter(function () { return true });
var currentTeam = 0;
var previousTeam = 0;
var lastCorrectTeam = 0;
var previousCorrectTeam = 0;
var questionAttempts = numTeams;
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
var disableQuestionInput = false;

var money = '';

var keys = [49];
for (i=0; i<numTeams-1;i++){
  keys[i+1] = keys[i]+1;
}
var teamTracker = [];
for (i=0; i<numTeams;i++){
  teamTracker[i] = i;
}

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
  last = currentTeam;
  if (currentTeam < teams.length - 1) {
    currentTeam++;
  } else {
    currentTeam = 0;
  }
}

function reduceQuestions() {
  questionsLeft--;
}

function buttonSound() {
  var audio = new Audio('../Media/buttonpress.mp3');
  audio.play();
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
  $('#teamTurn').text(teams[lastCorrectTeam][0] + ' is up');
}

function updateScoreboard() {
  $('#t' + (currentTeam + 1)).empty();
  d = '$' + teams[currentTeam][1];
  $('#t' + (currentTeam + 1)).append(d);
}

function updateActiveTeam() {
  document.getElementsByClassName("s-table-text-active")[0].classList.remove('s-table-text-active');
  document.getElementById("t" + (lastCorrectTeam+1)).classList.add('s-table-text-active');
}

function controlAudio(b) {
  document.getElementById('background_audio').muted = b;
}

function nextQuestion() {
  reduceQuestions();
  $('#questionModal').modal('hide');
  currentQuestion.addClass('isDisabled');
  currentQuestion.children().addClass('disabled');
  document.getElementById("incorrect").removeAttribute("data-dismiss")
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
        document.getElementById("reveal").innerHTML = "Reveal Answer (space)";
      } else {
        document.getElementById("reveal").innerHTML = "Reveal Answer";
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
  maxBet = teams[lastCorrectTeam][1];
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
  
  hideTeamSelector();
  
  var audio = new Audio('../Media/dd.mp3');
  audio.play();

  ddCategory = category;
  ddQuestionID = questionid;

  document.getElementById("bet-input").addEventListener('keydown', function (event) {
    if (event.keyCode == 13) { // enter key
      event.preventDefault();
      document.getElementById("ddbtn").click();
    }
  });

  teamTracker = [lastCorrectTeam];

  disableQuestionInput = true;
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

    rebuildTeamSelector();
    for (i=0; i<numTeams; i++){
      if (i!=lastCorrectTeam){
        var teamAttempted = document.getElementById("option"+i);
        teamAttempted.parentNode.removeChild(teamAttempted);
      }
    }
    

    var modal = document.getElementById('questionModal');
    document.getElementById('questionModalLabel').innerHTML = (categories[ddCategory] + ' for $' + money);
    document.getElementsByClassName('card-text')[0].innerHTML = (questions[ddCategory][ddQuestionID]);
    document.getElementById("bet-input").removeEventListener('keydown', function (event) {
      if (event.keyCode == 13) { // enter key
        event.preventDefault();
        document.getElementById("ddbtn").click();
      }
    });
    disableQuestionInput = false;
    var ddOptions = document.getElementById("daily-double");
    ddOptions.parentNode.removeChild(ddOptions);
    document.getElementById("questionModal").focus();
  }
}

function setupTeamSelector(){
  var teamSelector = document.getElementById("team-selector");
  var options = '';
  for (i = 0; i < numTeams; i++){
    options += '<option value="'+i+'" id="option'+i+'">Team '+(i+1)+'</option>';
  }
  teamSelector.innerHTML = options;
}

function hideTeamSelector(){
  document.getElementById("modal-team-selector").classList.add("hidden");
  document.getElementById("modal-team-selector").style.height = "0%";
  document.getElementById("modal-team-selector").innerHTML = "";
}

function rebuildTeamSelector(){
  var lbl = document.createElement("label");
  lbl.setAttribute("for", "teams");
  lbl.innerHTML = "Buzzed In:";
  
  var slct = document.createElement("select");
  slct.setAttribute("name", "teams");
  slct.setAttribute("id", "team-selector");
  var options = '';
  for (i = 0; i < numTeams; i++){
    options += '<option value="'+i+'" id="option'+i+'">Team '+(i+1)+'</option>';
  }
  slct.innerHTML = options;
  
  var teamSelector = document.getElementById("modal-team-selector");
  teamSelector.appendChild(lbl);
  teamSelector.appendChild(slct);
  teamSelector.classList.remove("hidden");
  teamSelector.removeAttribute("style");
  teamSelector.style.paddingRight = "10px"
}

function resetTeamTracker(){
  for (i=0; i<numTeams;i++){
    teamTracker[i] = i;
  }
}

$(document).ready(function () {
  var category = '';
  var questionid = '';

  setupBoard();
  setupScoreBoard();
  setupTeamSelector();
  whosTurnIsIt();


  $('a').click(function () {
    currentQuestion = $(this);
    hintCheck();
    questionAttempts = numTeams;
    setupTeamSelector();
    resetTeamTracker();
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
    if (!disableQuestionInput){
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
      else if (keys.includes(event.keyCode)) { // 2
        if(teamTracker.indexOf(keys.indexOf(event.keyCode)) > -1){
          event.preventDefault();
          document.getElementById('team-selector').value=keys.indexOf(event.keyCode);
        }
      }
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
    currentTeam = parseInt(document.getElementById("team-selector").value);
    lastCorrectTeam = parseInt(document.getElementById("team-selector").value)
    teams[currentTeam][1] += parseInt(money);
    nextQuestion();
  });

  $('#incorrect').click(function () {
    currentTeam = parseInt(document.getElementById("team-selector").value);
    teams[parseInt(document.getElementById("team-selector").value)][1] -= parseInt(money);
    questionAttempts--;
    updateScoreboard();
    var teamAttempted = document.getElementById("option"+currentTeam);
    teamAttempted.parentNode.removeChild(teamAttempted);

    for( var i = 0; i < teamTracker.length; i++){
      if (teamTracker[i] == teamAttempted.value) { 
        teamTracker.splice(i, 1); 
      }
    }

    if (questionAttempts == 0 || questionsLeft == dd){
      nextQuestion();
    }
  });

  $('#close').click(function () {
    if (questionAttempts != numTeams || questionsLeft == dd){
      nextQuestion();
    }
  });
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