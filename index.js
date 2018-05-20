const jsgraphs = require('js-graph-algorithms');
const _ = require('lodash');

var g = new jsgraphs.WeightedGraph(8);
var pairingsOfVertices = [];

var generateGraph = (graph) => {
  graph.addEdge(new jsgraphs.Edge(0, 1, 5.0));
  graph.addEdge(new jsgraphs.Edge(0, 4, 9.0));
  graph.addEdge(new jsgraphs.Edge(0, 7, 8.0));
  graph.addEdge(new jsgraphs.Edge(1, 2, 12.0));
  graph.addEdge(new jsgraphs.Edge(1, 3, 15.0));
  graph.addEdge(new jsgraphs.Edge(1, 7, 4.0));
  graph.addEdge(new jsgraphs.Edge(2, 3, 3.0));
  graph.addEdge(new jsgraphs.Edge(2, 6, 11.0));
  graph.addEdge(new jsgraphs.Edge(3, 6, 9.0));
  graph.addEdge(new jsgraphs.Edge(4, 5, 5.0));
  graph.addEdge(new jsgraphs.Edge(4, 6, 20.0));
  graph.addEdge(new jsgraphs.Edge(4, 7, 5.0));
  graph.addEdge(new jsgraphs.Edge(5, 2, 1.0));
  graph.addEdge(new jsgraphs.Edge(5, 6, 13.0));
  graph.addEdge(new jsgraphs.Edge(7, 5, 6.0));
  graph.addEdge(new jsgraphs.Edge(7, 2, 7.0));
};

var checkGraphConsistent = (graph) => {
  var oddVertices = [];
  
  for (let i = 0; i < graph.V; i++) {
    if (graph.adj(i).length % 2 !== 0) {
      // oddVertices.push(graph.adj(i)); // -> add object with vertices
      oddVertices.push(i);
    }
  }

  return oddVertices;
};

var setPairingsOfVertices = (graph) => {
  const numbersOfOddVertices =  checkGraphConsistent(graph);

  for (let i = 0; i < numbersOfOddVertices.length; ++i) {
    for (let j = i + 1; j < numbersOfOddVertices.length; ++j) {
      pairingsOfVertices.push({'v1': numbersOfOddVertices[i], 'v2': numbersOfOddVertices[j]});
    }
  }

  return pairingsOfVertices;
};

var dijkstraAlgorithm = (graph) => {
  console.log('In this place we will be find shorter path with Dijkstra ALgorithm!')
  // _.each(pairs, (pair) => {
  //   var dijkstra = new jsgraphs.Dijkstra(graph, pair.v1);
  //     if(dijkstra.hasPathTo(pair.v2)){
  //         var path = dijkstra.pathTo(pair.v2);
  //         console.log('=====path from ' + pair.v1 + ' to ' + pair.v2 + ' start==========');
  //         for(var i = 0; i < path.length; ++i) {
  //             var e = path[i];
  //             console.log(e.from() + ' => ' + e.to() + ': ' + e.weight);
  //         }
  //         console.log('=====path from ' + pair.v1 + ' to ' + pair.v2 + ' end==========');
  //         console.log('=====distance: '  + dijkstra.distanceTo(pair.v2) + '=========');
  //     }
  // });
};

var initChinesePostmanProblem = () => {
  generateGraph(g);

  if (setPairingsOfVertices(g).length === 0) {
    console.log('Graph is not consistent!');
  } else {
    console.log('Grpah is consistent!');
  }

  console.log(pairingsOfVertices);

  dijkstraAlgorithm(g);
}


initChinesePostmanProblem(g);
