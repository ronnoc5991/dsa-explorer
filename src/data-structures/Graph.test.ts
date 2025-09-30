import { describe, expect, it } from "vitest";
import { Vertex } from "./Vertex";
import { AdjacencyList, AdjacencyMatrix, Graph } from "./Graph";

const graphImplementations: Record<string, (vertices: Array<Vertex>) => Graph> =
  {
    AdjacencyList: (vertices) => new AdjacencyList(vertices),
    AdjacencyMatrix: (vertices) => new AdjacencyMatrix(vertices),
  };

Object.entries(graphImplementations).forEach(
  ([implementationName, implementingClass]) => {
    describe(implementationName, () => {
      it("adds an undirected edge with provided weight between two vertices", () => {
        const a: Vertex = [0, 0];
        const b: Vertex = [1, 1];
        const vertices = [a, b];
        const weight = 10;

        const graph = implementingClass(vertices);

        graph.addEdge(a, b, weight);

        expect(graph.getNeighbors(a)).toStrictEqual([b]);
        expect(graph.getNeighbors(b)).toStrictEqual([a]);
        expect(graph.getEdgeWeight(a, b)).toBe(weight);
        expect(graph.getEdgeWeight(b, a)).toBe(weight);
      });

      it("returns a list of vertices that neighbor the given vertex", () => {
        const a: Vertex = [0, 0];
        const b: Vertex = [1, 1];
        const c: Vertex = [2, 2];
        const d: Vertex = [3, 3];
        const graph = implementingClass([a, b, c, d]);
        const weight = 1;

        graph.addEdge(a, b, weight);
        graph.addEdge(a, c, weight);

        const aNeighbors = graph.getNeighbors(a);

        expect(aNeighbors).toEqual([b, c]);
        expect(graph.getEdgeWeight(a, b)).toBe(weight);
        expect(graph.getEdgeWeight(a, c)).toBe(weight);
        expect(graph.getEdgeWeight(a, d)).toBe(Infinity);
      });
    });
  }
);
