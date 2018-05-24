const _ = require('lodash');

var dijkstra = require('./dijkstra').dijkstra;
var distMatrix =
  [[Infinity, 7,        9,        Infinity, Infinity, 16],
  [7,        Infinity, 10,       15,       Infinity, Infinity],
  [9,        10,       Infinity, 11,       Infinity, 2],
  [Infinity, 15,       11,       Infinity, 6,        Infinity],
  [Infinity, Infinity, Infinity, 6,        Infinity, 9],
  [16,       Infinity, 2,        Infinity, 9,        Infinity]];

var pairingsOfOddVertices = [];

var hasPath = (current, goal) => {
  var stack = [], visitedNodes = [], node;
  stack.push(current);
  visitedNodes[current] = true;

  while (stack.length) {
    node = stack.pop();
    if (node === goal) return true;

    for (let i = 0; i < distMatrix[node].length; i++) {
      if (distMatrix[node][i] && !visitedNodes[i]) {
        stack.push(i);
        visitedNodes[i] = true;
      }
    }
  }
  return false;
}

var checkGraphIsConsistent = () => {
  var pairingsOfVertices = [];
  var check = false;

  for (let i = 0; i < distMatrix.length; i++) {
    for (let j = i + 1; j < distMatrix.length; j++) {
      pairingsOfVertices.push({'v1': i, 'v2': j});
    }
  }

  _.each(pairingsOfVertices, (pair) => {
    if (hasPath(pair.v1, pair.v2)) {
      check = true;
    } else {
      return false;
    }
  });

  return check;
}

var findOddVerticies = () => {
  var oddVertices = [];
  
  for (let i = 0; i < distMatrix.length; i++) {
    var numberOfEdges = 0;
    for (let j = 0; j < distMatrix[i].length; j++) {
      (distMatrix[i][j] !== Infinity) ? numberOfEdges++ : numberOfEdges;
    }

    if (numberOfEdges % 2 !== 0) {
      oddVertices.push(i);
    }
  }

  return oddVertices;
};

var setPairingsOfVertices = () => {
  const numbersOfOddVertices = findOddVerticies();

  for (let i = 0; i < numbersOfOddVertices.length; i++) {
    for (let j = i + 1; j < numbersOfOddVertices.length; j++) {
      pairingsOfOddVertices.push({'v1': numbersOfOddVertices[i], 'v2': numbersOfOddVertices[j], 'isCalculated': false});
    }
  }

  console.log(pairingsOfOddVertices);
  return pairingsOfOddVertices;
};

var initChinesePostmanProblem = () => {

  if (checkGraphIsConsistent()) {
    console.log('Graph is consistent!');
    if (setPairingsOfVertices().length !== 0) {
      console.log('Graph have odd verticies! Half-Euler Graph');
    } else {
      console.log('Grpah havent odd verticies! Euler Graph');
    }
  } else {
    console.log('Graph isnt consistent!');
  }
}

// var shortestDist = dijkstra(0, 5, distMatrix);

// console.log(shortestDist);


initChinesePostmanProblem();

// dijkstra(column, row, graph)

