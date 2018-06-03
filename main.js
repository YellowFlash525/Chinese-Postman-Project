const _ = require('lodash');

var path = [];

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

var addNewEdge = (array, edge, transitionValue) => {
  graph[array].numberOfTransitions++;
  graph[array].edges.push({
    idEdge: edge,
    transitionValue: transitionValue
  });
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
    if (vertex === graph[i].idNode) {
      for (let j = 0; j < graph.length; j++) {
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

var initDijkstra = (vertexStart, vertexEnd, road) => {
  var nodesWithDijkstraValue = [], nodesWithoutDijkstraValue = [], cost = [], predecessors = [];
  nodesWithoutDijkstraValue = getAllNodes();

  _.each(graph, (node, index) => {
    cost[index] = Infinity;
    predecessors[index] = -1;
  });

  cost[vertexStart] = 0;

  while (_.size(nodesWithoutDijkstraValue) > 0) {
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

  if (road) {
    let path = [], index = vertexEnd;
    path.push(index);
    _.each(predecessors, (predecessor) => {
      if (predecessors[index] !== -1) {
        path.push(predecessors[index]);
        index = predecessors[index];
      }
    });
    return path;
  }

  console.log('Dijkstra: Path cost from: ' + vertexStart + ' to ' + vertexEnd + ' is: ' + cost[vertexEnd]);
  return cost[vertexEnd];
}

var countDijkstraForOddVerticies = (oddNodes, all) => {
  for (let i = 0; i < oddNodes.length - 1; i++) {
    for (let j = i + 1; j < oddNodes.length; j++) {
      all.push({from: oddNodes[i], to: oddNodes[j], used: false, transitionValue: initDijkstra(oddNodes[i], oddNodes[j], false)});
    }
  }
}

var checkAllConnects = (all, pairs, taken) => {
  _.each(all, (con, index) => {
    taken = [];
    if (taken.indexOf(all[index].from) === -1) taken.push(all[index].from);
    if (taken.indexOf(all[index].to) === -1) taken.push(all[index].to);

    for (let index2 = 0; index2 < all.length; index2++) {
      if (index !== index2 && taken.indexOf(all[index2].from) === -1) taken.push(all[index2].from);
      if (index !== index2 && taken.indexOf(all[index2].to) === -1) taken.push(all[index2].to);
    }

    pairs.push(taken);
  });
}

var checkMinimumValueOfPath = (allConnects, nodePairs, minimum) => {
  _.each(nodePairs, (pair, id) => {
    var valueOfTransitions = 0;
    for (let j = 0; j < pair.length; j+=2) {
      _.each(allConnects, (connect) => {
        if ((connect.from === nodePairs[j] && connect.to === nodePairs[j + 1]) || (connect.from === nodePairs[j+1] && connect.to === nodePairs[j])) {
          valueOfTransitions = valueOfTransitions + connect.transitionValue;
        }
      })
    }

    if (minimum > valueOfTransitions) {
      minimum = valueOfTransitions;
    }
  });
}

var depthFirstSearch = (vertex) => {
  var neighbours = getNeighbourOfVertex(vertex);
  _.each(neighbours, (neighbour) => {
    var getTransitionBetweenTwoNodesTmp = getTransitionBetweenTwoNodes(vertex, neighbour, true);
    _.each(graph[vertex].edges, (edge, index) => {
      if (JSON.stringify(edge) === JSON.stringify(getTransitionBetweenTwoNodesTmp)) {
        graph[vertex].numberOfTransitions--;
        path.push(edge.idEdge);
        graph[vertex].edges.splice(index, 1);
      }
    });

    _.each(graph[neighbour].edges, (edge, index) => {
      if (JSON.stringify(edge) === JSON.stringify(getTransitionBetweenTwoNodesTmp)) {
        graph[neighbour].numberOfTransitions--;
        graph[neighbour].edges.splice(index, 1);
      }
    });

    depthFirstSearch(graph[neighbour].idNode);
  });
}

var getValueAllEdges = () => {
  var newArr = [];
  _.each(graph, (node) => {
    _.each(node.edges, (edge) => {
      if (!newArr.includes(edge.idEdge)) {
        newArr.push(edge);
      }
    });
  });

  return newArr;
}

var duplicateAssociatedEdges = (array) => {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array[i].length-1; j++) {
      var edge = getTransitionBetweenTwoNodes(array[i][j], array[i][j+1], true).idEdge;
      var transitionValue = getTransitionBetweenTwoNodes(array[i][j], array[i][j+1], true).transitionValue;

      edge = edge + '2'; // name for new edge
      addNewEdge(array[i][j], edge, transitionValue);
      addNewEdge(array[i][j+1], edge, transitionValue);      
    }
  }
}

var postmanProblem = (vertex) => {
  // set number of transitions in object
  countNumberOfTransitions();
  if (checkGraphIsConsistent()) {
    console.log('Graph is consistent!');
    var oddNodes = [], allConnects = [], used = [], takenValues = [], nodePairs = [], newArr = [];
    var minimum = Infinity, index = 0;

    oddNodes = findOddVerticies(); 
    newArr = getValueAllEdges();

    // counting shorter path between two verticies and adding to allConnects array
    countDijkstraForOddVerticies(oddNodes, allConnects);

    // check all connects and find all asossiated nodes
    checkAllConnects(allConnects, nodePairs, takenValues);
    checkMinimumValueOfPath(allConnects, nodePairs);

    var arrayWithDijkstra = [];
    for (let j = 0; j < nodePairs[index].length; j+=2) {
      arrayWithDijkstra.push(initDijkstra(nodePairs[index][j], nodePairs[index][j+1], true));
    }

    duplicateAssociatedEdges(arrayWithDijkstra);

    depthFirstSearch(vertex);

    console.log("Shorter path: " + path.join().replace(/,/g, ' -> '));

    var allCostOfPath = 0;

    _.each(path, (edge) => {
      allCostOfPath += newArr.find(x => x.idEdge === edge[0]).transitionValue;
    });
    
    console.log('Path cost: ' + allCostOfPath);
  } else {
    console.log("Graph isn't consistent");
  }
}

postmanProblem(graph[0].idNode);
