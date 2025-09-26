import { AdjacencyList } from "./Graph";

// write these test to test both version of the graph...
// the same exact tests, just with different classes used under the hood

describe("AdjacencyList", () => {
  test("adds an undirected edge between two vertices", () => {
    const adjList = new AdjacencyList();
    const vertexA = "A";
    const vertexB = "B";

    adjList.addEdge(vertexA, vertexB);

    expect(adjList.hasEdge(vertexA, vertexB)).toBeTrue();
    expect(adjList.hasEdge(vertexB, vertexA)).toBeTrue();
  });

  test("removes an undirected edge between two vertices", () => {
    const adjList = new AdjacencyList();
    const vertexA = "A";
    const vertexB = "B";

    adjList.addEdge(vertexA, vertexB);
    adjList.removeEdge(vertexA, vertexB);

    expect(adjList.hasEdge(vertexA, vertexB)).toBeFalse();
    expect(adjList.hasEdge(vertexB, vertexA)).toBeFalse();
  });

  test("returns a list of edges from a given vertex", () => {
    const adjList = new AdjacencyList();
    const vertexA = "A";
    const vertexB = "B";
    const vertexC = "C";
    const vertexD = "D";

    adjList.addEdge(vertexA, vertexB);
    adjList.addEdge(vertexA, vertexC);
    adjList.addEdge(vertexA, vertexD);
    adjList.removeEdge(vertexA, vertexD);

    const edgesFromVertexA = adjList.getEdges(vertexA);

    expect(edgesFromVertexA).toEqual([vertexB, vertexC]);
  });
});
