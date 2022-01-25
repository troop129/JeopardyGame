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
  var t = "team"+i;
  teams[i] = ['Team ' + i, data[t]];
}
teams = teams.filter(function () { return true });
teams.sort(sorter);
console.log(teams);

function sorter(a, b) {
    if (a[1] === b[1]) {
        return 0;
    }
    else {
        return (a[1] > b[1]) ? -1 : 1;
    }
}

var winner = document.createElement("h1");
var scores = document.createElement("h2");
s = ""
winner.innerHTML = ""+teams[0][0]+" with a score of " + teams[0][1];
for (i = 1; i < numTeams; i++){
  s += teams[i][0] + ": " +teams[i][1] + "\n";
}
scores.innerHTML = s;
document.body.appendChild(winner);
document.body.appendChild(scores);
