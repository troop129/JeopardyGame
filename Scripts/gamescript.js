var categories = ['Unity', 'Chapter Questions', 'Adobe Animate', 'Visual Studio', 'Copyright'];
var questions = [
  ['This is the shortcut for the move tool.', 'This needs to be done before starting the lego micro-game.', 'This is the the shortcut for the scale tool.', 'This is where you interact with the game being built.', 'This is the button that allows you to change your camera orientation.', 'This is the the shortcut for the select tool.'],
  ['This person creates the controls for the player.', 'This generation is when home video game systems became popular.', 'This person creates character depth and interaction.', "This perspective has you looking through the character's eyes.", 'This person creates the visual elements and assets of the game.', 'This is the thing that makes a product different from the competion. '],
  ['This is the shortcut for undo.', 'This the button to insert a keyframe. ', 'This the button to make a symbol.', 'This is the shortcut to group things together.', 'This is the shortcut for the scale tool.', "This was used to make Alfonso's tail."],
  ['This is what you need to keep in mind when typing.', 'This is what you end a line of code with.', 'This is the way to print in C#.', 'This is used to ignore a line of code.', 'This is how you check if your code works.', 'This the button that is pushed to auto complete part of a line of code.'],
  ['This is the symbol for copyright.', 'This allows for complte use of the work without any extra steps needed.', 'This requires you to share a work with the same liscenses attached.', 'This makes you unable to edit the work under this .', 'This prevents you from using the work for profit.', 'This requires you to give credit.']];
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
console.log(teams);
var currentTeam = 0;
var previousTeam = 0;
var questionsLeft = categories.length * questions[0].length;
var isAnsReveal = false;

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
      link.setAttribute('data-money', ((j + 1) * 100).toString());
      link.setAttribute('data-questionid', j.toString());
      var listItem = document.createElement('li');
      listItem.className = 'list-group-item';
      var amount = document.createTextNode('$' + (j + 1) * 100);
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
      var h = "<th>Team "+ i +"</th>";
      if (i == 1){
        var d = '<td class="s-table-text-active" id="t'+ i +'">$0</td>';
      } else{
        var d = '<td id="t'+ i +'">$0</td>';
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
  console.log(questionsLeft);
}

function checkForWinner() {
  if (questionsLeft == 27) {
    var url = "result.html?teams=" + encodeURIComponent(numTeams);
    for(i=0; i<numTeams; i++){
      url += "&team"+(i+1)+"="+ encodeURIComponent(teams[i][1]);
    }
    document.location.href = url;
  }
}

function whosTurnIsIt() {
  $('#teamTurn').text(teams[currentTeam][0] + ' is up');
}

function updateScoreboard() {
  console.log(currentTeam);
  $('#t' + (currentTeam + 1)).empty();
  d = '$' + teams[currentTeam][1];
  $('#t' + (currentTeam + 1)).append(d);
}

function updateActiveTeam() {
  document.getElementById("t"+(currentTeam+1)).classList.add('s-table-text-active');
  document.getElementById("t"+(previousTeam+1)).classList.remove('s-table-text-active');
}

function nextQuestion() {
  $('#questionModal').modal('hide');
  isAnsReveal = false;
  updateScoreboard();
  incrementTeam();
  whosTurnIsIt();
  updateActiveTeam();
  checkForWinner();
}

$(document).ready(function () {
  var category = '';
  var money = '';
  var questionid = '';

  setupBoard();
  setupScoreBoard();
  whosTurnIsIt();


  $('a').click(function () {
    $(this).addClass('isDisabled');
    $(this).children().addClass('disabled');
    reduceQuestions();
  });

  $('#questionModal').on('shown.bs.modal', function (event) {
    var link = $(event.relatedTarget);
    category = link.data('category');
    money = link.data('money');
    questionid = link.data('questionid');


    var modal = $(this);
    modal.find('.modal-title').text(categories[category] + ' for $' + money);
    modal.find('.modal-body p').text(questions[category][questionid]);
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
      document.getElementById("reveal").innerHTML = "Reveal Question";
      isAnsReveal = true;
      return;
    }
    $('#questionModal').find('.modal-body p').text(questions[category][questionid]);
    isAnsReveal = false;
    document.getElementById("reveal").innerHTML = "Reveal Answer";
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
    console.log('hello');
  })
});