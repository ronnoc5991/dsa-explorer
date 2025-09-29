import { describe, expect, it } from "vitest";
import Vertex from "./Vertex";
import { AdjacencyList, AdjacencyMatrix, Graph } from "./Graph";

const graphImplementations: Record<string, (vertices: Array<Vertex>) => Graph> =
  {
    AdjacencyList: (vertices) => new AdjacencyList(vertices),
    AdjacencyMatrix: (vertices) => new AdjacencyMatrix(vertices),
  };

Object.entries(graphImplementations).forEach(
  ([implementationName, implementingClass]) => {
    describe(implementationName, () => {
      it("adds an edge (undirected) between two vertices", () => {
        const vertexA = new Vertex("A");
        const vertexB = new Vertex("B");
        const vertices = [vertexA, vertexB];
        const weight = 10;

        const graph = implementingClass(vertices);

        graph.addEdge({ vertexA, vertexB, weight });

        expect(graph.getNeighbors(vertexA)).toStrictEqual([vertexB]);
        expect(graph.getNeighbors(vertexB)).toStrictEqual([vertexA]);
        expect(graph.getEdgeWeight(vertexA, vertexB)).toBe(weight);
        expect(graph.getEdgeWeight(vertexB, vertexA)).toBe(weight);
      });

      it("removes the edge (undirected) between two vertices", () => {
        const vertexA = new Vertex("A");
        const vertexB = new Vertex("B");
        const vertices = [vertexA, vertexB];
        const graph = implementingClass(vertices);

        graph.addEdge({ vertexA, vertexB, weight: 10 });
        graph.removeEdge(vertexA, vertexB);

        expect(graph.getNeighbors(vertexA)).toStrictEqual([]);
        expect(graph.getNeighbors(vertexB)).toStrictEqual([]);
      });

      it("returns a list of vertices neighboring the given vertex", () => {
        const vertexA = new Vertex("A");
        const vertexB = new Vertex("B");
        const vertexC = new Vertex("C");
        const vertexD = new Vertex("D");
        const graph = implementingClass([vertexA, vertexB, vertexC, vertexD]);
        const weight = 1;

        graph.addEdge({ vertexA, vertexB, weight });
        graph.addEdge({ vertexA, vertexB: vertexC, weight });
        graph.addEdge({ vertexA, vertexB: vertexD, weight });
        graph.removeEdge(vertexA, vertexD);

        const aNeighbors = graph.getNeighbors(vertexA);

        expect(aNeighbors).toEqual([vertexB, vertexC]);
        expect(graph.getEdgeWeight(vertexA, vertexB)).toBe(weight);
        expect(graph.getEdgeWeight(vertexA, vertexC)).toBe(weight);
        expect(graph.getEdgeWeight(vertexA, vertexD)).toBe(Infinity);
      });
    });
  }
);
