import { describe, expect, it } from "vitest";
import { AdjacencyList, Graph } from "../data-structures/Graph";
import { VertexName, vertexPositionToName } from "../data-structures/Vertex";
import { Dijkstra, AStar } from "./ShortestPath";

const shortestPathAlgorithms = {
  AStar: (
    graph: Graph,
    start: VertexName,
    end: VertexName,
    stepDuration: number
  ) => new AStar(graph, start, end, stepDuration),
  Dijkstra: (
    graph: Graph,
    start: VertexName,
    end: VertexName,
    stepDuration: number
  ) => new Dijkstra(graph, start, end, stepDuration),
};

const testingStepDuration = 0;

Object.entries(shortestPathAlgorithms).forEach(([algoName, implementation]) => {
  describe(algoName, () => {
    it("should return null when there is no path between two vertices", async () => {
      const a = vertexPositionToName({ x: 0, y: 0 });
      const b = vertexPositionToName({ x: 1, y: 1 });
      const c = vertexPositionToName({ x: 2, y: 2 });
      const graph = new AdjacencyList([a, b, c]);

      const algo = implementation(graph, a, c, testingStepDuration);

      const answer = await algo.findShortestPath();

      expect(answer).toBe(null);
    });

    it("should find the shortest path in a graph with a single valid path", async () => {
      const a = vertexPositionToName({ x: 0, y: 0 });
      const b = vertexPositionToName({ x: 1, y: 1 });
      const c = vertexPositionToName({ x: 2, y: 2 });
      const graph = new AdjacencyList([a, b, c]);
      graph.addEdge(a, b, 1);
      graph.addEdge(b, c, 1);

      const algo = implementation(graph, a, c, testingStepDuration);

      const answer = await algo.findShortestPath();

      expect(answer).toStrictEqual([a, b, c]);
    });

    it("should find the shortest path in a graph with multiple valid paths", async () => {
      const a = vertexPositionToName({ x: 0, y: 0 });
      const b = vertexPositionToName({ x: 1, y: 1 });
      const c = vertexPositionToName({ x: 2, y: 2 });
      const d = vertexPositionToName({ x: 3, y: 3 });
      const graph = new AdjacencyList([a, b, c, d]);
      graph.addEdge(a, b, 1);
      graph.addEdge(b, c, 1);
      graph.addEdge(c, d, 1);
      graph.addEdge(a, d, 4);

      const algo = implementation(graph, a, d, testingStepDuration);

      const answer = await algo.findShortestPath();

      expect(answer).toStrictEqual([a, b, c, d]);
    });
  });
});
