const _ = require('lodash');
var dijkstra = require('./dijkstra').dijkstra;

var graph =
  [{idNode: 0, edges: [{idEdge: '1', transitionValue: 7}, {idEdge: '2', transitionValue: 9}, {idEdge: '3', transitionValue: 16}]},
  {idNode: 1, edges: [{idEdge: '1', transitionValue: 7}, {idEdge: '4', transitionValue: 10}, {idEdge: '5', transitionValue: 15}]},
  {idNode: 2, edges: [{idEdge: '2', transitionValue: 9}, {idEdge: '4', transitionValue: 10}, {idEdge: '6', transitionValue: 11}, {idEdge: '9', transitionValue: 2}]},
  {idNode: 3, edges: [{idEdge: '5', transitionValue: 15}, {idEdge: '6', transitionValue: 11}, {idEdge: '7', transitionValue: 6}]},
  {idNode: 4, edges: [{idEdge: '7', transitionValue: 6}, {idEdge: '8', transitionValue: 9}]},
  {idNode: 5, edges: [{idEdge: '3', transitionValue: 16}, {idEdge: '8', transitionValue: 9}, {idEdge: '9', transitionValue: 2}]}];

var countNumberOfTransitions = () => {
    _.each(graph, (node) => {
        node.numberOfTransitions = node.edges.length;
    })
};

var findOddVerticies = () => {
    var oddVertices = [];
    
    _.each(graph, (node) => {
        if (node.edges.length % 2 !== 0) oddVertices.push(node.idNode);
    })
  
    return oddVertices;
  };

var checkGraphIsConsistent = () => {
  var stack = [], visitedNodes = [], nodeCurrent, counter = 0;
  stack.push(graph[0].idNode);
  visitedNodes[0] = true;

  while (stack.length) {
    nodeCurrent = stack[_.size(stack)-1];
    stack.splice(_.size(stack) - 1, 1);

    counter++;
    _.each(graph, (node) => {
      if (nodeCurrent === parseInt(node.idNode)) {
        _.each(graph, (node1) => {
          _.each(node.edges, (edge) => {
            _.each(node1.edges, (edge1) => {
              if (edge.idEdge === edge1.idEdge) {
                if (visitedNodes[node1.idNode] === undefined) {
                  stack.push(node1.idNode)
                }
                visitedNodes[node1.idNode] = true;
              }
            });
          });
        });
      }
    });
  }

  return (counter === graph.length) ? true : false;
}

var getTransitionValue = (transitions1, transitions2, status) => {
  _.each(transitions1, (transition1) => {
    _.each(transitions2, (transition2) => {
      if (transition1.idEdge === transition2.idEdge) {
        if (status) {
          return transition1;
        }

        return transition1.transitionValue;
      }
    });
  });
}

var getTransitionBetweenTwoNodes = (vertexStart, vertexEnd, status) => {
  var trans1 = [], trans2 = [];

  _.each(graph, (node) => {
    if (node.idNode === vertexStart) trans1 = node.edges; 
    if (node.idNode === vertexEnd) trans2 = node.edges;
  });

  (trans1.length >= trans2.length) ? getTransitionValue(trans1, trans2, status) : getTransitionValue(trans2, trans1, status);
}

var getAllNodes = () => {
  var array = [];

  _.each(graph, (node) => {
    array.push(node.idNode);
  });

  return array;
}

var initDijkstra = (vertexStart, vertexEnd) => {
  let nodesWithoutDijkstraValue = [], nodesWithDijkstraValue = [], predecessors = [], transitionCost = [];

  nodesWithoutDijkstraValue = getAllNodes();

  _.each(graph, (node) => {
    predecessors[node.id] = -1;
    transitionCost[node.id] = Infinity;
  })

  transitionCost[vertexStart];

  while (nodesWithoutDijkstraValue.length > 0) {
    //TODO
  }
}


var initChinesePostmanProblem = () => {
  if (checkGraphIsConsistent()) {
    console.log('Graph is consistent!');

    if (findOddVerticies().length !== 0) {
      console.log('Graph have odd verticies! Half-Euler Graph');
    } else {
      console.log('Graph haven`t odd verticies! Euler Graph');
    }
  } else {
    console.log('Graph isn`t consistent!');
  }
}

initChinesePostmanProblem();
