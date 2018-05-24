((exports) => {
  'use strict';

  var dijkstra = (() => {

    var Heap = require('./libs/heap.js').Heap;
    var current;
    var visited;
    var distance;
    var unvisited;

    function Node(id, distance) {
      this.node = id;
      this.distance = distance;
    }

    var compareNodesDistance = (a, b) => {
      return b.distance - a.distance;
    }

    var init = (src, graph) => {
      var currentTemp;
      current = {};
      visited = [];
      distance = [];
      unvisited = new Heap(compareNodesDistance);
      for (let i = 0; i < graph.length; i++) {
        currentTemp = new Node();
        if (src === i) {
          currentTemp.distance = 0;
        } else {
          currentTemp.distance = Infinity;
        }

        currentTemp.node = i;
        visited[i] = false;
        distance[i] = currentTemp;
        unvisited.add(currentTemp);
      }
      current.node = src;
      current.distance = 0;
    }

    return (src, dest, graph) => {
      var tempDistance = 0;
      init(src, graph);
      while (current.node !== dest && isFinite(current.distance)) {
        for (let i = 0; i < graph.length; i++) {
          if (current.node !== i && !visited[i] && Number.isFinite(graph[i][current.node])) {
            tempDistance = current.distance + graph[i][current.node];
            if (tempDistance < distance[i].distance) {
              distance[i].distance = tempDistance;
              unvisited.update(current);
            }
          }
        }
        visited[current.node] = true;
        current = unvisited.extract();
      }
      if (distance[dest]) {
        return distance[dest].distance;
      }
      return Infinity;
    };
  })();

  exports.dijkstra = dijkstra;

})(typeof window === 'undefined' ? module.exports : window);