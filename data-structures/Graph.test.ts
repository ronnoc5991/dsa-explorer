import { describe, expect, it } from "vitest";

import { AdjacencyList, AdjacencyMatrix, Graph, Vertex } from "./Graph";

const graphImplementations: Record<string, (vertices: Array<Vertex>) => Graph> =
  {
    AdjacencyList: (vertices) => new AdjacencyList(vertices),
    AdjacencyMatrix: (vertices) => new AdjacencyMatrix(vertices),
  };

Object.entries(graphImplementations).forEach(
  ([implementationName, implementingClass]) => {
    describe(implementationName, () => {
      it("adds an edge (undirected) between two vertices", () => {
        const vertexA = "A";
        const vertexB = "B";
        const vertices = [vertexA, vertexB];

        const graph = implementingClass(vertices);

        graph.addEdge(vertexA, vertexB);

        expect(graph.hasEdge(vertexA, vertexB)).toBe(true);
        expect(graph.hasEdge(vertexB, vertexA)).toBe(true);
      });

      it("removes the edge (undirected) between two vertices", () => {
        const vertexA = "A";
        const vertexB = "B";
        const vertices = [vertexA, vertexB];
        const graph = implementingClass(vertices);

        graph.addEdge(vertexA, vertexB);
        graph.removeEdge(vertexA, vertexB);

        expect(graph.hasEdge(vertexA, vertexB)).toBe(false);
        expect(graph.hasEdge(vertexB, vertexA)).toBe(false);
      });

      it("returns a list of edges leaving a given vertex", () => {
        const vertexA = "A";
        const vertexB = "B";
        const vertexC = "C";
        const vertexD = "D";
        const vertices = [vertexA, vertexB, vertexC, vertexD];
        const graph = implementingClass(vertices);

        graph.addEdge(vertexA, vertexB);
        graph.addEdge(vertexA, vertexC);
        graph.addEdge(vertexA, vertexD);
        graph.removeEdge(vertexA, vertexD);

        const edgesFromVertexA = graph.getEdges(vertexA);

        expect(edgesFromVertexA).toEqual([vertexB, vertexC]);
      });
    });
  }
);
