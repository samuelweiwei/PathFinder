//Factory model to use one instance to test
const loadGraph = require("./loadGraph");
//Data should check the input in load Graph
describe("Routes with max stops test", ()=>{
    test("With unexisted node input", ()=>{
        var routes = loadGraph.findRoutesWithMaxStops('A', 'K', 4);
        expect(routes.length).toBe(0);
    })

    test("With illegal node input", ()=>{
        var routes = loadGraph.findRoutesWithMaxStops(1, 2, 3);
        expect(routes.length).toBe(0);
    })

    test("With illegal stops number input", ()=>{
        var routes = loadGraph.findRoutesWithMaxStops('A', 'C', -1);
        expect(routes.length).toBe(0);
    })

    test("With illegal parameters numbers", ()=>{
        var routes = loadGraph.findRoutesWithMaxStops('A', 'C', -1, 2);
        expect(routes.length).toBe(0);
    })

    test("With legal parameters but doesnot have routes", ()=>{
        var routes = loadGraph.findRoutesWithMaxStops('C', 'A', 4);
        expect(routes.length).toBe(0);
    })
    
    test("Valid input with output to be expected", ()=>{
        var routes = loadGraph.findRoutesWithMaxStops('A', 'C', 3);
        var finalRet = loadGraph.filterDuplicates(routes);
        expect(finalRet.length).toBe(3);
    })
});


describe("Routes with exact stops test", ()=>{
    test("With unexisted node input", ()=>{
        var routes = loadGraph.findRoutesWithExactStops('A', 'K', 4);
        expect(routes.length).toBe(0);
    })

    test("With illegal node input", ()=>{
        var routes = loadGraph.findRoutesWithExactStops(1, 2, 3);
        expect(routes.length).toBe(0);
    })

    test("With illegal stops number input", ()=>{
        var routes = loadGraph.findRoutesWithExactStops('A', 'C', -1);
        expect(routes.length).toBe(0);
    })

    test("Valid input with output to be expected-1", ()=>{
        var routes = loadGraph.findRoutesWithExactStops('A', 'C', 2);
        expect(routes.length).toBe(2);
    })

    test("Valid input with output to be expected-2", ()=>{
        var routes = loadGraph.findRoutesWithExactStops('A', 'C', 3);
        var finalRet = loadGraph.filterDuplicates(routes);
        expect(finalRet.length).toBe(1);
    })
});

describe("Route with max distance", ()=>{
    test("With unexisted node input", ()=>{
        var routes = loadGraph.findRouteWithMaxDistances('A', 'K', 20);
        expect(routes.length).toBe(0);
    })

    test("With illegal node input", ()=>{
        var routes = loadGraph.findRouteWithMaxDistances('A', 1, 'd')
        expect(routes.length).toBe(0);
    })

    test("With illegal stops number input", ()=>{
        var routes = loadGraph.findRouteWithMaxDistances(1, 2, 3)
        expect(routes.length).toBe(0);
    })

    test("Valid input with output to be expected-2", ()=>{
        var routes = loadGraph.findRouteWithMaxDistances('A', 'C', 30);
        var finalRet = loadGraph.filterDuplicates(routes);
        expect(finalRet.length).toBe(11);
    })
});

describe("Shortest path", ()=>{
    test("With unexisted node input", ()=>{
        var routes = loadGraph.shortestPathDijkstra('A', 'K');
        expect(routes.distance).toBe(0);
    })

    test("With illegal node input", ()=>{
        var routes = loadGraph.shortestPathDijkstra('A', 2)
        expect(routes.distance).toBe(0);
    })

    test("With illegal stops number input", ()=>{
        var routes = loadGraph.shortestPathDijkstra(1, 2)
        expect(routes.distance).toBe(0);
    })

    test("Valid input with output to be expected-2", ()=>{
        var routes = loadGraph.shortestPathDijkstra('A', 'C');
        expect(routes.distance).toBe(9);
    })
});

describe("Distance Calculate", ()=>{
    test("With unexisted node input", ()=>{
        var dist = loadGraph.calculatePathDistance('A', 'K');
        expect(dist).toBe(0);
    })

    test("With illegal node input", ()=>{
        var dist = loadGraph.calculatePathDistance('A', 2)
        expect(dist).toBe(0);
    })

    test("Undirect connect nodes with output to be expected", ()=>{
        var dist = loadGraph.calculatePathDistance('A','C');
        expect(dist).toBe(0);
    })

    test("Valid nodes with output to be expected-1", ()=>{
        var dist = loadGraph.calculatePathDistance("A,B,C");
        expect(dist).toBe(9);
    })
});