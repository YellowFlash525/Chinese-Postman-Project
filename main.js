const _ = require('lodash');
var arrayTransition = [];

var graph =
  [{idNode: 0, edges: [{idEdge: 'a', transitionValue: 8}, {idEdge: 'b', transitionValue: 9}, {idEdge: 'c', transitionValue: 16}]},
  {idNode: 1, edges: [{idEdge: 'a', transitionValue: 8}, {idEdge: 'd', transitionValue: 10}, {idEdge: 'e', transitionValue: 15}]},
  {idNode: 2, edges: [{idEdge: 'b', transitionValue: 9}, {idEdge: 'd', transitionValue: 10}, {idEdge: 'f', transitionValue: 11}, {idEdge: 'i', transitionValue: 2}]},
  {idNode: 3, edges: [{idEdge: 'e', transitionValue: 15}, {idEdge: 'f', transitionValue: 11}, {idEdge: 'g', transitionValue: 6}]},
  {idNode: 4, edges: [{idEdge: 'g', transitionValue: 6}, {idEdge: 'h', transitionValue: 9}]},
  {idNode: 5, edges: [{idEdge: 'c', transitionValue: 16}, {idEdge: 'h', transitionValue: 9}, {idEdge: 'i', transitionValue: 2}]}];

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
    nodeCurrent = stack[_.size(stack) - 1];
    stack.splice(_.size(stack) - 1, 1);

    counter++;
    _.each(graph, (node) => {
      if (nodeCurrent === parseInt(node.idNode)) {
        _.each(graph, (node1, id) => {
          _.each(node.edges, (edge) => {
            _.each(node1.edges, (edge1) => {
              if (edge.idEdge === edge1.idEdge) {
                if (visitedNodes[id] === undefined) {
                  stack.push(node1.idNode)
                }
                visitedNodes[id] = true;
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
  for (let i = 0; i < transitions1.length; i++) {
    for (let j = 0; j < transitions2.length; j++) {
      if (transitions1[i].id === transitions2[j].id){
        if (status === true) return transitions1[i];
        return transitions1[i].transitionValue;
      }
    }
  }
}

var getTransitionBetweenTwoNodes = (vertexStart, vertexEnd, status) => {
  var trans1 = [], trans2 = [], length = 0;

  _.each(graph, (node) => {
    if (node.idNode === vertexStart) trans1 = node.edges; 
    if (node.idNode === vertexEnd) trans2 = node.edges;
  });

  return (trans1.length >= trans2.length) ? getTransitionValue(trans1, trans2, status) : getTransitionValue(trans2, trans1, status);
}

var getAllNodes = () => {
  let all = [];

  _.each(graph, (node) => {
    all.push(node.idNode);
  });

  return all;
}

var getNeighbourOfVertex = (vertex) => {
  var neighbours = [];
  _.each(graph, (node) => {
    if (vertex === node.idNode) {
      _.each(graph, (node1) => {
        _.each(node.edges, (edge) => {
          _.each(node1.edges, (edge1) => {
            // console.log(edge.idEdge + ' ' + edge1.idEdge);
            if (edge.idEdge === edge1.idEdge) neighbours.push(node1.idNode);
          });
        });
      });

      for (let i = neighbours.length - 1; i >= 0; i--) {
        if (vertex === neighbours[i]) neighbours.splice(i, 1);
      }
    }
  });

  return neighbours;
}

var initDijkstra = (vertexStart, vertexEnd) => {
  var nodesWithoutDijkstraValue = [], nodesWithDijkstraValue = [], predecessors = [], transitionCost = [];

  nodesWithoutDijkstraValue = getAllNodes();

  _.each(graph, (node) => {
    transitionCost[node.idNode] = Infinity;
    predecessors[node.idNode] = -1;
  })

  transitionCost[vertexStart] = 0;

  while (nodesWithoutDijkstraValue.length > 0) {
    var min = Infinity, index = 0;

    _.each(nodesWithoutDijkstraValue, (node, id) => {
      if (transitionCost[node] <= min) {
        min = transitionCost[node];
        index = id;
      }
    });

    nodesWithDijkstraValue.push(nodesWithoutDijkstraValue[index]);
    nodesWithoutDijkstraValue.splice(index, 1);

    // console.log(nodesWithDijkstraValue[nodesWithDijkstraValue.length - 1]);
    var neighboursArray = getNeighbourOfVertex(nodesWithDijkstraValue[nodesWithDijkstraValue.length - 1]);
    
    _.each(neighboursArray, (neighbour) => {
      _.each(nodesWithoutDijkstraValue, (value) => {
        if (value == neighbour) {
          if (transitionCost[value] > transitionCost[nodesWithDijkstraValue[_.size(nodesWithDijkstraValue)-1]] + getTransitionBetweenTwoNodes(nodesWithDijkstraValue[_.size(nodesWithDijkstraValue)-1], value, false)) {
            predecessors[value] = nodesWithDijkstraValue[_.size(nodesWithDijkstraValue)-1];
            transitionCost[value] = transitionCost[nodesWithDijkstraValue[_.size(nodesWithDijkstraValue)-1]] + getTransitionBetweenTwoNodes(nodesWithDijkstraValue[_.size(nodesWithDijkstraValue)-1], value, false);
          }
        }
      })
    })
  }

  console.log('Koszt drogi do: ' + vertexEnd + ' to ' + transitionCost[vertexEnd] + ' z punktu ' + vertexStart)
  return transitionCost[vertexEnd];
}

var dfs = (index) => {
  var neighbours = getNeighbourOfVertex(index);

  _.each(neighbours, (neighbour) => {
    var transitionBetweenTwoNodes = getTransitionBetweenTwoNodes(index, neighbour);
    _.each(graph[index].edges, (edge, id) => {
      if (edge === transitionBetweenTwoNodes) {
        graph[index].numberOfTransitions--;
        arrayTransition.push(edge.idEdge)
        graph[index].edges.splice(id,1);
      }
    });

    _.each(graph[neighbour].edges, (edge, id) => {
      if (edge === transitionBetweenTwoNodes) {
        graph[neighbours[i]].numberOfTransitions--;
        graph[neighbours[i]].edges.splice(id, 1);
      }
    });

    dfs(graph[neighbour].idEdge);
  });
}


var initChinesePostmanProblem = (vertex) => {
  if (checkGraphIsConsistent()) {
    console.log('Graph is consistent!');

    if (findOddVerticies().length !== 0) {
      console.log('Graph have odd verticies! Half-Euler Graph');
      //zmienić
      var oddArray = [];
        var allPossibilities = [];
        var used = [];
        var takenValues = [];
        var pairs = [];
        oddArray = findOddVerticies(oddArray)
        for (var i = 0; i < oddArray.length - 1; i++){
            for (var j = i + 1; j < oddArray.length; j++){
                allPossibilities.push({
                    from: oddArray[i],
                    to: oddArray[j],
                    used: false,
                    value: initDijkstra(oddArray[i], oddArray[j])
                })
            }
        }

        for (var i = 0; i < allPossibilities.length; i++){
            if (takenValues.indexOf(allPossibilities[i].from) === -1){
                takenValues.push(allPossibilities[i].from)
            }
            if (takenValues.indexOf(allPossibilities[i].to) === -1){
                takenValues.push(allPossibilities[i].to)
            }
            for (var j = 0; j < allPossibilities.length; j++){
                if (i !== j){
                        if (takenValues.indexOf(allPossibilities[j].from) === -1){
                            takenValues.push(allPossibilities[j].from)
                        }
                        if (takenValues.indexOf(allPossibilities[j].to) === -1){
                            takenValues.push(allPossibilities[j].to)
                        }
                    }
            }
            pairs.push(takenValues)
            takenValues = [];
        }

        console.log(oddArray);
        console.log(allPossibilities);
        console.log(pairs);

        var min = Infinity;
        var index = 0;
        for (var i = 0; i < pairs.length; i++){
            var sum = 0;
            for (var j = 0; j < pairs[i].length; j+=2){
                for (var x = 0; x < allPossibilities.length; x++){
                    if ((allPossibilities[x].from === pairs[i][j] && allPossibilities[x].to === pairs[i][j + 1]) ||
                        (allPossibilities[x].from === pairs[i][j+1] && allPossibilities[x].to === pairs[i][j])) {
                            sum = sum + allPossibilities[x].transitionValue
                        }
                }
            }
            if ( min > sum){
                index = i;
                min = sum;
            }
        }
        var arrayWithDijkstra = [];
        for (var j = 0; j < pairs[index].length; j+=2){
            arrayWithDijkstra.push(initDijkstra(pairs[index][j], pairs[index][j+1], true))
        } 

        for (var i = 0; i < arrayWithDijkstra.length; i++){
            for (var j = 0; j < arrayWithDijkstra[i].length-1; j++){
                var name = getTransitionBetweenTwoNodes(arrayWithDijkstra[i][j], arrayWithDijkstra[i][j+1], true).idNode;
                var value = getTransitionBetweenTwoNodes(arrayWithDijkstra[i][j], arrayWithDijkstra[i][j+1], true).transitionValue;

                name = name + name;
                node[arrayWithDijkstra[i][j]].numberOfTransitions++;
                node[arrayWithDijkstra[i][j]].edges.push({
                    id: name,
                    value: value
                })
                node[arrayWithDijkstra[i][j+1]].numberOfTransitions++;
                node[arrayWithDijkstra[i][j+1]].edges.push({
                    id: name,
                    value: value
                })
                    
            }
        }

        dfs(vertex);

        console.log(arrayTransition);
    } else {
      console.log('Graph haven`t odd verticies! Euler Graph');
    }
  } else {
    console.log('Graph isn`t consistent!');
  }
}

initChinesePostmanProblem(graph[0].idNode);
