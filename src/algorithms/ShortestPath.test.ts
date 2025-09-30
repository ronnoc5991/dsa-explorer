import { describe, expect, it } from "vitest";
import { AdjacencyList, Graph } from "../data-structures/Graph";
import { Vertex } from "../data-structures/Vertex";
import { Dijkstra, AStar } from "./ShortestPath";

const shortestPathAlgorithms = {
  Dijkstra: (graph: Graph) => new Dijkstra(graph),
  AStar: (graph: Graph) => new AStar(graph),
};

function getGraphWithNoEdges() {
  const a: Vertex = [0, 0];
  const b: Vertex = [1, 1];
  const c: Vertex = [2, 2];
  const graph = new AdjacencyList([a, b, c]);
  return graph;
}

function getGraphWithSinglePath() {
  const a: Vertex = [0, 0];
  const b: Vertex = [1, 1];
  const c: Vertex = [2, 2];
  const graph = new AdjacencyList([a, b, c]);
  graph.addEdge(a, b, 1);
  graph.addEdge(b, c, 1);
  return graph;
}

function getGraphWithCompetingPaths() {
  const a: Vertex = [0, 0];
  const b: Vertex = [1, 1];
  const c: Vertex = [2, 2];
  const d: Vertex = [3, 3];
  const graph = new AdjacencyList([a, b, c, d]);
  graph.addEdge(a, b, 1);
  graph.addEdge(b, c, 1);
  graph.addEdge(c, d, 1);
  graph.addEdge(a, d, 4);
  return graph;
}

Object.entries(shortestPathAlgorithms).forEach(([algoName, implementation]) => {
  describe(algoName, () => {
    it("should return null when there is no path between two vertices", () => {
      const graph = getGraphWithNoEdges();
      const vertices = graph.getVertices();

      const algo = implementation(graph);

      const answer = algo.findShortestPath(
        vertices[0],
        vertices[vertices.length - 1]
      );

      expect(answer).toBe(null);
    });

    it("should find the shortest path in a graph with a single valid path", () => {
      const graph = getGraphWithSinglePath();
      const vertices = graph.getVertices();

      const algo = implementation(graph);

      const answer = algo.findShortestPath(
        vertices[0],
        vertices[vertices.length - 1]
      );

      expect(answer).toStrictEqual(vertices);
    });

    it("should find the shortest path in a graph with multiple valid paths", () => {
      const graph = getGraphWithCompetingPaths();
      const vertices = graph.getVertices();

      const algo = implementation(graph);

      const answer = algo.findShortestPath(
        vertices[0],
        vertices[vertices.length - 1]
      );

      expect(answer?.length).toEqual(4);
    });
  });
});
