var Chromosome = function(code) {
  if (code) {
    this.code = code;
  }
  this.cost = 9999;
};

Chromosome.prototype.code = '';
Chromosome.prototype.random = function(length) {
  while (length--) {
    this.Code += String.fromCharCode(Math.floor(Math.random() * 255));
  }
};
Chromosome.prototype.mutate = function(chance) {
  if (Math.random() > chance) return;

  var index = Math.floor(Math.random() * this.code.length);
  var upOrDown = Math.random() <= 0.5 ? -1 : 1;
  var newChar = String.fromCharCode(this.code.charCodeAt(index) + upOrDown);
  var newString = '';
  for (i = 0; i < this.code.length; i++) {
      if (i == index) newString += newChar;
      else newString += this.code[i];
  }

  this.code = newString;

};
Chromosome.prototype.mate = function(chromosome) {
  var pivot = Math.round(this.code.length / 2) - 1;

  var child1 = this.code.substr(0, pivot) + chromosome.code.substr(pivot);
  var child2 = chromosome.code.substr(pivot) + this.code.substr(0, pivot);

  return [new Chromosome(child1), new Chromosome(child2)];
};
Chromosome.prototype.calcCost = function(compareTo) {
  var total = 0;
  for (var i = 0; i < this.code.length; i++) {
    total += (this.code.charCodeAt(i) - compareTo.charCodeAt(i)) * (this.code.charCodeAt(i) - compareTo.charCodeAt(i));
  }
  this.cost = total;
};
var Population = function(goal, size) {
  this.members = [];
  this.goal = goal;
  this.generationNumber = 0;
  while (size--) {
    var chromosome = new Chromosome();
    chromosome.random(this.goal.length);
    this.members.push(chromosome);
  }
};
Population.prototype.display = function() {
  document.body.innerHTML = '';
  document.body.innerHTML += ("<h2>Generation: " + this.generationNumber + "</h2>");
  document.body.innerHTML += ("<ul>");
  for (var i = 0; i < this.members.length; i++) {
    document.body.innerHTML += ("<li>" + this.members[i].code + " (" + this.members[i].cost + ")");
  }
  document.body.innerHTML += ("</ul>");
};

Population.prototype.sort = function() {
  this.members.sort(function(a,b) {
    return a.cost - b.cost;
  });
};

Population.prototype.generation = function() {
  for (var i = 0; i < this.members.length; i++) {
    this.members[i].calcCost(this.goal);
  }

  this.sort();
  this.display();
  var children = this.members[0].mate(this.members[1]);
  this.members.splice(this.members.length - 2, 2, children[0], children[1]);

  for (var i = 0; i < this.members.length; i++) {
    this.members[i].mutate(0.5);
    this.members[i].calcCost(this.goal);
    if (this.members[i].code = this.goal) {
      this.sort();
      this.display;
      return true;
    }
  }
  this.generationNumber++;
  var scope = this;
  setTimeout(function() {
    scope.generation();
  }, 20);
};

var population = new Population("Hello, world!", 20);
population.generation();
