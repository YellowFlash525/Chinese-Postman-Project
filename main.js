const _ = require('lodash');

var graph =
  [{idNode: 0, edges: [{idEdge: 'a', transitionValue: 8}, {idEdge: 'b', transitionValue: 9}, {idEdge: 'c', transitionValue: 16}]},
  {idNode: 1, edges: [{idEdge: 'a', transitionValue: 8}, {idEdge: 'd', transitionValue: 10}, {idEdge: 'e', transitionValue: 15}]},
  {idNode: 2, edges: [{idEdge: 'b', transitionValue: 9}, {idEdge: 'd', transitionValue: 10}, {idEdge: 'f', transitionValue: 11}, {idEdge: 'i', transitionValue: 2}]},
  {idNode: 3, edges: [{idEdge: 'e', transitionValue: 15}, {idEdge: 'f', transitionValue: 11}, {idEdge: 'g', transitionValue: 6}]},
  {idNode: 4, edges: [{idEdge: 'g', transitionValue: 6}, {idEdge: 'h', transitionValue: 9}], numberOfTransitions: 2},
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
  });

  return oddVertices;
};

var getAllNodes = () => {
  let all = [];

  _.each(graph, (node) => {
    all.push(node.idNode);
  });

  return all;
}

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
                if (visitedNodes[id] === undefined) stack.push(node1.idNode);
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

var getNeighbourOfVertex = (vertex) => {
  var neighbours = [];
  for (let i = 0 ; i < graph.length; i++) {
    if (vertex === graph[i].idNode){
      for (let j = 0; j < graph.length; j++){
        for (let z = 0; z < graph[i].edges.length; z++) {
          for (let x = 0; x < graph[j].edges.length; x++) {
            if (graph[i].edges[z].idEdge === graph[j].edges[x].idEdge) neighbours.push(graph[j].idNode)
          }
        }
      }

      for (let i = neighbours.length - 1; i >= 0; i--){
          if (vertex === neighbours[i]) neighbours.splice(i, 1);
      }

      return neighbours;
    }
  }
}

var getTransitionBetweenTwoNodes = (node1,node2, status) => {
  let trans1 = [];
  let trans2 = [];

  _.each(graph, (node) => {
    if (node.idNode === node1) trans1 = node.edges;
    if (node.idNode === node2) trans2 = node.edges;
  });

  if (trans1.length >= trans2.length) {
    for (let i = 0; i < trans1.length; i++) {
      for (let j = 0; j < trans2.length; j++) {
        if (trans1[i].idEdge === trans2[j].idEdge) {
          if (status) return trans1[i];
          return trans1[i].transitionValue;
        }
      }
    }
  } else {
      for (let i = 0; i < trans2.length; i++) {
        for (let j = 0; j < trans1.length; j++) {

          if (trans2[i].idEdge === trans1[j].idEdge) {
            if (status) return trans2[i];
            return trans2[i].transitionValue;
          }     
        }
      }
  }
}

var initDijkstra = (vertexStart, vertexEnd, showLinks) => {
  var nodesWithDijkstraValue = [], nodesWithoutDijkstraValue = [], cost = [], predecessors = [];
  nodesWithoutDijkstraValue = getAllNodes();

  for (var i = 0; i < graph.length; i++){
      cost[i] = Infinity;
      predecessors[i] = -1;
  }
  cost[vertexStart] = 0;

  while (nodesWithoutDijkstraValue.length > 0) {
    var minimumPath = Infinity, index = 0;

    _.each(nodesWithoutDijkstraValue, (value,id) => {
      if (cost[value] <= minimumPath) {
        minimumPath = cost[value];
        index = id;
      }
    });

    nodesWithDijkstraValue.push(nodesWithoutDijkstraValue[index])
    nodesWithoutDijkstraValue.splice(index,1)

    var neigbours = getNeighbourOfVertex(nodesWithDijkstraValue[nodesWithDijkstraValue.length-1])
    for (let i = 0; i < neigbours.length; i++) {
      for (let j = 0; j < nodesWithoutDijkstraValue.length; j++) {
        if (nodesWithoutDijkstraValue[j] == neigbours[i] && cost[nodesWithoutDijkstraValue[j]] > cost[nodesWithDijkstraValue[nodesWithDijkstraValue.length-1]] + getTransitionBetweenTwoNodes(nodesWithDijkstraValue[nodesWithDijkstraValue.length-1], nodesWithoutDijkstraValue[j], false)){
          cost[nodesWithoutDijkstraValue[j]] = cost[nodesWithDijkstraValue[nodesWithDijkstraValue.length-1]] + getTransitionBetweenTwoNodes(nodesWithDijkstraValue[nodesWithDijkstraValue.length-1], nodesWithoutDijkstraValue[j], false)
          predecessors[nodesWithoutDijkstraValue[j]] = nodesWithDijkstraValue[nodesWithDijkstraValue.length-1]
        }
      }
    }
  }

  if (showLinks) {
    let path = [], temp = vertexEnd;
    path.push(temp);
    for (let i = 0; i < predecessors.length; i++) {
      if (predecessors[temp] !== -1) {
          path.push(predecessors[temp]);
          temp = predecessors[temp];
      }
    }
    return path;
  }

  console.log('Dijkstra: Path cost from: ' + vertexStart + ' to ' + vertexEnd + ' is: ' + cost[vertexEnd]);
  return cost[vertexEnd];
}

var path = [];
var dfs = (vertex) =>{
  var neighbours = getNeighbourOfVertex(vertex);
  _.each(neighbours, (neighbour) => {
    var getTransitionBetweenTwoNodesTmp = getTransitionBetweenTwoNodes(vertex, neighbour, true);
    _.each(graph[vertex].edges, (edge, id) => {
      if (JSON.stringify(edge) === JSON.stringify(getTransitionBetweenTwoNodesTmp)) {
        graph[vertex].numberOfTransitions--;
        path.push(edge.idEdge);
        graph[vertex].edges.splice(id, 1);
      }
    });

    _.each(graph[neighbour].edges, (edge, id) => {
      if (JSON.stringify(edge) === JSON.stringify(getTransitionBetweenTwoNodesTmp)) {
        graph[neighbour].numberOfTransitions--;
        graph[neighbour].edges.splice(id, 1);
      }
    });

    dfs(graph[neighbour].idNode);
  });
}

var postmanProblem = (vertex) => {
  // set number of transitions in object
  countNumberOfTransitions();
  if (checkGraphIsConsistent()) {
    console.log('Graph is consistent!');
    var oddArray = [], allConnects = [], used = [], takenValues = [], nodePairs = [];
    var minimum = Infinity, index = 0;

    oddArray = findOddVerticies();
    //spróbować przerobić na each
    for (let i = 0; i < oddArray.length - 1; i++){
      for (let j = i + 1; j < oddArray.length; j++){
        allConnects.push({
            from: oddArray[i],
            to: oddArray[j],
            used: false,
            transitionValue: initDijkstra(oddArray[i], oddArray[j], false)
        })
      }
    }

    // zmienić na osobną metoda
    for (let i = 0; i < allConnects.length; i++) {
      if (takenValues.indexOf(allConnects[i].from) === -1) takenValues.push(allConnects[i].from);
      if (takenValues.indexOf(allConnects[i].to) === -1) takenValues.push(allConnects[i].to);

      for (let j = 0; j < allConnects.length; j++) {
        if (i !== j && takenValues.indexOf(allConnects[j].from) === -1) takenValues.push(allConnects[j].from);
        if (i !== j && takenValues.indexOf(allConnects[j].to) === -1) takenValues.push(allConnects[j].to);
      }

      nodePairs.push(takenValues);
      takenValues = [];
    }
    //zrobić osobną metode
    for (let i = 0; i < nodePairs.length; i++) {
      var sum = 0;
      for (let j = 0; j < nodePairs[i].length; j+=2) {
        for (let x = 0; x < allConnects.length; x++) {
          if ((allConnects[x].from === nodePairs[i][j] && allConnects[x].to === nodePairs[i][j + 1]) ||
            (allConnects[x].from === nodePairs[i][j+1] && allConnects[x].to === nodePairs[i][j])) {
              sum = sum + allConnects[x].transitionValue;
            }
        }
      }

      if (minimum > sum) {
        index = i;
        minimum = sum;
      }
    }

    var arrayWithDijkstra = [];
    for (let j = 0; j < nodePairs[index].length; j+=2) {
      arrayWithDijkstra.push(initDijkstra(nodePairs[index][j], nodePairs[index][j+1], true))
    } 

    // zrobi osobną metode
    for (let i = 0; i < arrayWithDijkstra.length; i++) {
      for (let j = 0; j < arrayWithDijkstra[i].length-1; j++) {
        var name = getTransitionBetweenTwoNodes(arrayWithDijkstra[i][j], arrayWithDijkstra[i][j+1], true).idEdge;
        var transitionValue = getTransitionBetweenTwoNodes(arrayWithDijkstra[i][j], arrayWithDijkstra[i][j+1], true).transitionValue;

        name = name + name;
        graph[arrayWithDijkstra[i][j]].numberOfTransitions++;
        graph[arrayWithDijkstra[i][j]].edges.push({
            idEdge: name,
            transitionValue: transitionValue
        })
        graph[arrayWithDijkstra[i][j+1]].numberOfTransitions++;
        graph[arrayWithDijkstra[i][j+1]].edges.push({
            idEdge: name,
            transitionValue: transitionValue
        })       
      }
    }

    dfs(vertex);

    console.log("Shorter path: " + path.join().replace(/,/g, ' -> '));

    var allCostOfPath = 0;
    _.each(path, (edge) => {
      _.each(graph, (node) => {
        _.each(node.edges, (edges) => {
          
        });
      });
    });
    console.log('Koszt scieżki: ' + allCostOfPath);
  } else {
    console.log("Graph isn't consistent");
  }
}

postmanProblem(graph[0].idNode);
