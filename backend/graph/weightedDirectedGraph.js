const { MinPriorityQueue } = require("@datastructures-js/priority-queue");
const logger = require("../global/logger");

//Weighted directed graph class
class WeightedDirectedGraph {
  constructor() {
    this.adjList = new Map();
  }
  //Add one node
  addNode(node) {
    if (!this.adjList.has(node)) {
      this.adjList.set(node, []);
    }
  }
  //Single direction edge
  addEdge(src, dest, weight) {
    if (!src || !dest) {
      logger.error(
        `src is not available with value of [${src}], or dest is not available with value of [${dest}]`
      );
    }
    if (!this.adjList.has(src)) {
      this.adjList.set(src, []);
    }
    if (!this.adjList.has(dest)) {
      this.adjList.set(dest, []);
    }
    this.adjList.get(src).push({ node: dest, distance: weight });
  }

  //single direction remove
  removeEdge(src, dest) {
    if (!src || !dest) {
      logger.error(
        `src is not available with value of [${src}], or dest is not available with value of [${dest}]`
      );
    }
    if (this.adjList.has(src)) {
      this.adjList.set(
        src,
        this.adjList.get(src).filter((item) => item.node !== dest)
      );
    } else {
      logger.warerrorn(`${src} does not exist as a src`);
    }
  }
  // Remove a node and all its outgoing and incoming edges
  removeNode(node) {
    if (this.adjList.has(node)) {
      this.adjList.delete(node);

      // Remove all edges pointing to the deleted node
      for (let [currentNode, edges] of this.adjList) {
        this.adjList.set(
          currentNode,
          edges.filter((edge) => edge.node !== node)
        );
      }
    }
  }

  //Get the outgoing neighbours of a node
  getNeighbours(node) {
    if (!node) {
      logger.error(`Empty node argument: ${node}`);
      return;
    }
    return this.adjList.has(node) ? this.adjList.get(node) : [];
  }

  //Display the graph
  display() {
    logger.info(`adjList length is ${this.adjList.size}`);
    for (let [node, edges] of this.adjList) {
      const edgeList = edges
        .map((edge) => `${edge.node} (distance: ${edge.distance})`)
        .join(", ");
      logger.log(`${node}: ${edgeList}`);
    }
  }

  //Calculat the path distance
  calculatePathDistance(...node) {
    let distanceTtl = 0;
    logger.info(node);

    if (!node) {
      logger.error("Cannot calculate the path on unll node");
      return distanceTtl;
    }
    const nodeArr = node[0].split(",").map((item) => item.trim());
    if (nodeArr.length <= 1) {
      logger.error("Cannot calculate the path on 1 node");
      return distanceTtl;
    }
    for (let i = 0; i < nodeArr.length - 1; i++) {
      if (this.adjList.has(nodeArr[i]) && this.adjList.has(nodeArr[i + 1])) {
        const src = this.adjList.get(nodeArr[i]);
        const dest = src.filter((item) => item.node === nodeArr[i + 1]);
        if (!dest || dest.length === 0) {
          logger.error(
            `No such route, break between ${nodeArr[i]} and ${nodeArr[i + 1]}`
          );
          return 0;
        }
        distanceTtl += dest[0].distance;
      } else {
        logger.error(`${nodeArr[i]} or ${nodeArr[i + 1]} does not exists. `);
        return distanceTtl;
      }
    }
    return distanceTtl;
  }

  //Use Dijkstra algorithm to calculate the shortest
  //path between two nodes
  //Input src and dest node, return the path and distance. If anomaly or no route exists, -1 will be output.
  shortestPathDijkstra(src, dest) {
    if (!this.adjList.has(src) || !this.adjList.has(dest)) {
      logger.error(`One or both nodes do not exist: src=${src}, dest=${dest}`);
      return { path: null, distance: 0 };
    }
    const distances = new Map();
    const previous = new Map();
    const priQ = new MinPriorityQueue((a, b) => a - b);
    const visited = new Set();

    for (const node of this.adjList.keys()) {
      distances.set(node, Infinity);
      previous.set(node, null);
    }
    distances.set(src, 0);
    priQ.enqueue({ node: src, distance: 0 });

    while (!priQ.isEmpty()) {
      const { node: currentNode, distance: currentDistance } = priQ.dequeue();
      if (visited.has(currentNode)) continue;
      visited.add(currentNode);

      // If we reach the destination, reconstruct the path
      if (currentNode === dest) {
        const path = [];
        let current = dest;
        while (current !== null) {
          path.unshift(current);
          current = previous.get(current);
        }
        return { path, distance: currentDistance };
      }

      for (const neighbour of this.getNeighbours(currentNode)) {
        const newDistance = currentDistance + neighbour.distance;
        if (newDistance < distances.get(neighbour.node)) {
          distances.set(neighbour.node, newDistance);
          previous.set(neighbour.node, currentNode);
          priQ.enqueue({
            node: neighbour.node,
            distance: newDistance,
          });
        }
      }
    }

    return { path: null, distance: 0 };
  }

  //Find the routes between nodes with the max stops as required
  //Return the array as sequential nodes path
  findRoutesWithMaxStops(src, dest, max, currentPath = [], currentStops = 0) {
    if (!this.adjList.has(src) || !this.adjList.has(dest)) {
      logger.error(`One or both nodes do not exist: src=${src}, dest=${dest}`);
      return [];
    }
    if (isNaN(max)) {
      logger.error(
        `Illegal input stops number is:${max}, and its type is ${typeof max}`
      );
      return [];
    }
    if (max <= 0) {
      logger.error(
        `Illegal input stops number is:${max}, and should be greater than zero`
      );
      return [];
    }
    currentPath.push(src);
    const routes = [];
    if (currentStops > max) {
      currentPath.pop();
      return routes;
    }

    if (src === dest && currentPath.length > 1) {
      routes.push([...currentPath]);
    }
    // logger.log(`src is ${src}, dest is ${dest}, max is ${max}, currentpath is ${currentPath}, routes is ${routes}`);
    for (const neighbour of this.getNeighbours(src)) {
      routes.push(
        ...this.findRoutesWithMaxStops(
          neighbour.node,
          dest,
          max,
          currentPath,
          currentStops + 1
        )
      );
    }

    currentPath.pop();
    return routes;
  }

  //Nesting call to get all distances satisfy the requirements, less than max distance.
  //Return the array of all available paths and distances
  findRouteWithMaxDistances(
    src,
    dest,
    maxDist,
    currentPath = [],
    currentDist = 0
  ) {
    //Argument check
    if (!this.adjList.has(src) || !this.adjList.has(dest)) {
      logger.error(`One or both nodes do not exist: src=${src}, dest=${dest}`);
      return [];
    }
    if (isNaN(maxDist)) {
      logger.error(
        `Illegal input stops number is:${maxDist}, and its type is ${typeof maxDist}`
      );
      return [];
    }

    const routes = [];
    currentPath.push(src);
    //Usual case, if the distance exceed the max one, backtrack
    if (currentDist >= maxDist) {
      currentPath.pop();
      return routes;
    }
    // If the current node is the destination and it's not the initial call, add the route
    if (src === dest && currentDist > 0) {
      routes.push({ path: [...currentPath], distance: currentDist });
    }
    // Explore all neighbors of the current node, BFS simile
    for (const neighbour of this.getNeighbours(src)) {
      routes.push(
        ...this.findRouteWithMaxDistances(
          neighbour.node,
          dest,
          maxDist,
          currentPath,
          currentDist + neighbour.distance
        )
      );
    }
    // Backtrack: Remove the current node from the path
    currentPath.pop();
    return routes;
  }

  findRoutesWithExactStops(
    src,
    dest,
    stops,
    currentPath = [],
    currentStops = 0
  ) {
    if (!this.adjList.has(src) || !this.adjList.has(dest)) {
      logger.error(`One or both nodes do not exist: src=${src}, dest=${dest}`);
      return [];
    }
    if (isNaN(stops)) {
      logger.error(
        `Illegal input stops number is:${stops}, and its type is ${typeof stops}`
      );
      return [];
    }
    currentPath.push(src);
    const routes = [];
    if (currentStops === stops + 1) {
      currentPath.pop();
      return routes;
    }
    // If the current node is the destination and it's not the initial call, add the route
    if (src === dest && currentPath.length === stops + 1) {
      routes.push([...currentPath]);
    }
    // logger.log(`src is ${src}, dest is ${dest}, max is ${max}, currentpath is ${currentPath}, routes is ${routes}`);
    for (const neighbour of this.getNeighbours(src)) {
      routes.push(
        ...this.findRoutesWithExactStops(
          neighbour.node,
          dest,
          stops,
          currentPath,
          currentStops + 1
        )
      );
    }

    currentPath.pop();
    return routes;
  }

  filterDuplicates(array) {
    const uniqueSet = new Set();
    return array.filter((subArray) => {
        const key = JSON.stringify(subArray);
        if (uniqueSet.has(key)) {
            return false; // Exclude duplicates
        } else {
            uniqueSet.add(key);
            return true; // Include unique subarray
        }
    });
}
}

module.exports = WeightedDirectedGraph;
