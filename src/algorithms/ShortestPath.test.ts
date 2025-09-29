import { describe, expect, it } from "vitest";
import { AdjacencyList, Graph } from "../data-structures/Graph";
import Vertex from "../data-structures/Vertex";
import Dijkstra from "./Dijkstra";

const shortestPathAlgorithms = {
  Dijkstra: (graph: Graph) => new Dijkstra(graph),
};

function getGraphWithNoEdges() {
  const a = new Vertex("a");
  const b = new Vertex("b");
  const c = new Vertex("c");
  const graph = new AdjacencyList([a, b, c]);
  return graph;
}

function getGraphWithSinglePath() {
  const a = new Vertex("a");
  const b = new Vertex("b");
  const c = new Vertex("c");
  const graph = new AdjacencyList([a, b, c]);
  graph.addEdge({ vertexA: a, vertexB: b, weight: 1 });
  graph.addEdge({ vertexA: b, vertexB: c, weight: 1 });
  return graph;
}

function getGraphWithCompetingPaths() {
  const a = new Vertex("a");
  const b = new Vertex("b");
  const c = new Vertex("c");
  const d = new Vertex("d");
  const graph = new AdjacencyList([a, b, c, d]);
  graph.addEdge({ vertexA: a, vertexB: b, weight: 1 });
  graph.addEdge({ vertexA: b, vertexB: c, weight: 1 });
  graph.addEdge({ vertexA: c, vertexB: d, weight: 1 });
  graph.addEdge({ vertexA: a, vertexB: d, weight: 4 });
  return graph;
}

Object.entries(shortestPathAlgorithms).forEach(([algoName, implementation]) => {
  describe(algoName, () => {
    it("should return null when there is no path between two vertices", () => {
      const graph = getGraphWithNoEdges();

      const algo = implementation(graph);

      const answer = algo.search(
        graph.vertices[0],
        graph.vertices[graph.vertices.length - 1]
      );

      expect(answer).toBe(null);
    });

    it("should find the shortest path in a graph with a single valid path", () => {
      const graph = getGraphWithSinglePath();

      const algo = implementation(graph);

      const answer = algo.search(
        graph.vertices[0],
        graph.vertices[graph.vertices.length - 1]
      );

      expect(answer).toStrictEqual(graph.vertices);
    });

    it("should find the shortest path in a graph with multiple valid paths", () => {
      const graph = getGraphWithCompetingPaths();

      const algo = implementation(graph);

      const answer = algo.search(
        graph.vertices[0],
        graph.vertices[graph.vertices.length - 1]
      );

      expect(answer?.length).toEqual(4);
    });
  });
});
