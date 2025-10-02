import { describe, expect, it } from "vitest";
import { AdjacencyList, Graph } from "../data-structures/Graph";
import { vertexPositionToName } from "../data-structures/Vertex";
import { Dijkstra, AStar } from "./ShortestPath";

const shortestPathAlgorithms = {
  Dijkstra: (graph: Graph) => new Dijkstra(graph),
  AStar: (graph: Graph) => new AStar(graph),
};

Object.entries(shortestPathAlgorithms).forEach(([algoName, implementation]) => {
  describe(algoName, () => {
    it("should return null when there is no path between two vertices", () => {
      const a = vertexPositionToName({ x: 0, y: 0 });
      const b = vertexPositionToName({ x: 1, y: 1 });
      const c = vertexPositionToName({ x: 2, y: 2 });
      const graph = new AdjacencyList([a, b, c]);

      const algo = implementation(graph);

      const answer = algo.findShortestPath(a, c);

      expect(answer).toBe(null);
    });

    it("should find the shortest path in a graph with a single valid path", () => {
      const a = vertexPositionToName({ x: 0, y: 0 });
      const b = vertexPositionToName({ x: 1, y: 1 });
      const c = vertexPositionToName({ x: 2, y: 2 });
      const graph = new AdjacencyList([a, b, c]);
      graph.addEdge(a, b, 1);
      graph.addEdge(b, c, 1);

      const algo = implementation(graph);

      const answer = algo.findShortestPath(a, c);

      expect(answer).toStrictEqual([a, b, c]);
    });

    it("should find the shortest path in a graph with multiple valid paths", () => {
      const a = vertexPositionToName({ x: 0, y: 0 });
      const b = vertexPositionToName({ x: 1, y: 1 });
      const c = vertexPositionToName({ x: 2, y: 2 });
      const d = vertexPositionToName({ x: 3, y: 3 });
      const graph = new AdjacencyList([a, b, c, d]);
      graph.addEdge(a, b, 1);
      graph.addEdge(b, c, 1);
      graph.addEdge(c, d, 1);
      graph.addEdge(a, d, 4);

      const algo = implementation(graph);

      const answer = algo.findShortestPath(a, d);

      expect(answer).toStrictEqual([a, b, c, d]);
    });
  });
});
