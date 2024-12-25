// import WeightedDirectedGraph from "./weightedDirectedGraph";
var WeightedDirectedGraph = require("./weightedDirectedGraph");
const loadedGraph = new WeightedDirectedGraph();
//load nodes
loadedGraph.addNode('A');
loadedGraph.addNode('B');
loadedGraph.addNode('C');
loadedGraph.addNode('D');

//load edges
loadedGraph.addEdge('A','D', 5);
loadedGraph.addEdge('A','E', 7);
loadedGraph.addEdge('A','B', 5);
loadedGraph.addEdge('D','E', 8);
loadedGraph.addEdge('E','B', 3);
loadedGraph.addEdge('D','C', 8);
loadedGraph.addEdge('C','D', 8);
loadedGraph.addEdge('C','E', 2);
loadedGraph.addEdge('A','E', 7);
loadedGraph.addEdge('B','C', 4);

// export default loadedGraph;
module.exports = loadedGraph;