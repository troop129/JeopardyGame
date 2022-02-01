# Jeopardy Game
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)[![Repl.it](https://img.shields.io/badge/Repl.it-%230D101E.svg?style=for-the-badge&logo=replit&logoColor=white)
](https://jeopardygame.troop129.repl.co/)

A simple game based on the NBC TV Show "Jeopardy". Players answer prompts with a question and etiher win or lose money. The questions are arranged on board, sorted by categories, in acending value. 

This is a dynamic implementation of the game, where the number of players can be adjusted and it will still work. 

You can see this project in action on a hosted [Repl](https://jeopardygame.troop129.repl.co/).

## How it Works
In this implementation, the user starts on a landing page where they can select how many players are playing.

![landing page](https://i.imgur.com/9jynJV9.gif)

The data of how many players are sent through the URL. For example, if they picked 4 players as shown above, the URl would say `https://jeopardygame.troop129.repl.co/Pages/game.html?teams=4`. This can then be decoded in the JS into the teams number, as shown in this snippet:
```javascript
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
```

This would return, for the 4 team scenario, an array such as this:
```
['Team 1',  0]
['Team 2',  0]
['Team 3',  0]
['Team 4',  0]
```
The element with index `1` is the score of the team.

There are a couple of functions that when the page is loaded, including board generation from a predetermined array of questions and answers. The board is a collection of divs with links, and when the link is pressed the code determines which tile it was and updates the text inside the Bootstrap Modal.

![clicking](https://i.imgur.com/FxBFUMU.gif)

Inside the modal is the title, question, team selector, and the button panel.

![modal](https://i.imgur.com/VGlGWFd.png)

The title updates with the category, and money based on location. The question takes the data from the array based on the position.
```js
$('#questionModal').on('shown.bs.modal', function (event) {
    var link = $(event.relatedTarget);
    category = link.data('category');
    money = link.data('money');
    questionid = link.data('questionid');
    var modal = $(this);
    modal.find('.modal-title').text(categories[category] + ' for $' + money);
    modal.find('.modal-body p').text(questions[category][questionid]);
    }
  });
```

The buttons are Bootstrap, with a few minor changes in the CSS. When clicked, they run a function based on the context. For example, when you press the `Reveal` button, if the question is shown it will show the answer, and update the button text, and vice versa if it was the answer.
```js
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
```

There  are keyboard shortcuts for the Reveal, Correct, and Incorrect buttons (space, c, and z, respectively), which is hinted for the first 5 questions then no longer hinted.

## Credits
The game was built upon the excellent starting point of a [Jeopardy game](https://github.com/scliff108/Jeopardy) by [scliff108](https://github.com/scliff108/). The code is heavily modified but still runs on the basic framework he created.
The dropdown menu on the `index.html` page is from this [codepen](https://codepen.io/ig_design/pen/MWKVrNR). Thanks to [Ivan Grozdic](https://codepen.io/ig_design) for his excellent implementation.
Jeopardy theme song from [Orange Free Sounds](https://orangefreesounds.com/jeopardy-theme-song/).
