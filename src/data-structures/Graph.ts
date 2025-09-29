import Edge from "./Edge";
import Vertex from "./Vertex";

export type Edges = Array<Edge>;

// TODO: for now, undirected graph... later maybe a directed graph?
export interface Graph {
  vertices: Array<Vertex>;
  addEdge({
    vertexA,
    vertexB,
    weight,
  }: {
    vertexA: Vertex;
    vertexB: Vertex;
    weight: number;
  }): void;
  removeEdge(vertexA: Vertex, vertexB: Vertex): void;
  getNeighbors(from: Vertex): Array<Vertex>;
  getEdgeWeight(from: Vertex, to: Vertex): number;
}

export class AdjacencyList implements Graph {
  public vertices: Array<Vertex>;
  private table: Map<Vertex, Edges>;

  constructor(vertices: Array<Vertex>) {
    this.vertices = vertices;
    this.table = new Map();
    vertices.forEach((vertex) => this.table.set(vertex, new Array()));
  }

  addEdge({ vertexA, vertexB, weight }: Parameters<Graph["addEdge"]>[0]) {
    if (!this.table.has(vertexA)) this.table.set(vertexA, new Array());
    if (!this.table.has(vertexB)) this.table.set(vertexB, new Array());
    this.table.get(vertexA)?.push(new Edge(vertexA, vertexB, weight));
    this.table.get(vertexB)?.push(new Edge(vertexB, vertexA, weight));
  }

  removeEdge(vertexA: Vertex, vertexB: Vertex) {
    if (this.table.has(vertexA))
      this.table.set(
        vertexA,
        this.table.get(vertexA)?.filter((edge) => edge.to !== vertexB) ??
          new Array()
      );
    if (this.table.has(vertexB))
      this.table.set(
        vertexB,
        this.table.get(vertexB)?.filter((edge) => edge.to !== vertexA) ??
          new Array()
      );
  }

  getNeighbors(from: Vertex): Array<Vertex> {
    return this.table.get(from)?.map((edge) => edge.to) ?? [];
  }

  getEdgeWeight(from: Vertex, to: Vertex): number {
    const edges = this.table.get(from);
    const edge = edges?.find((e) => e.to === to);
    return edge ? edge.weight : Infinity;
  }
}

export class AdjacencyMatrix implements Graph {
  public vertices: Array<Vertex>;
  private matrix: Array<Array<number>>;
  private vertexIndexTable: Record<Vertex["name"], number> = {};

  constructor(vertices: Array<Vertex>) {
    this.vertices = vertices;

    const numberOfVertices = vertices.length;

    this.matrix = Array.from({ length: numberOfVertices }).map(() =>
      new Array(numberOfVertices).fill(Infinity)
    );

    vertices.forEach((vertex, index) => {
      this.vertexIndexTable[vertex.name] = index;
    });
  }

  addEdge({ vertexA, vertexB, weight }: Parameters<Graph["addEdge"]>[0]) {
    if (
      !(vertexA.name in this.vertexIndexTable) ||
      !(vertexB.name in this.vertexIndexTable)
    )
      return;

    const vertexAIndex = this.vertexIndexTable[vertexA.name];
    const vertexBIndex = this.vertexIndexTable[vertexB.name];

    this.matrix[vertexAIndex][vertexBIndex] = weight;
    this.matrix[vertexBIndex][vertexAIndex] = weight;
  }

  removeEdge(vertexA: Vertex, vertexB: Vertex) {
    if (
      !(vertexA.name in this.vertexIndexTable) ||
      !(vertexB.name in this.vertexIndexTable)
    )
      return;

    const vertexAIndex = this.vertexIndexTable[vertexA.name];
    const vertexBIndex = this.vertexIndexTable[vertexB.name];

    this.matrix[vertexAIndex][vertexBIndex] = Infinity;
    this.matrix[vertexBIndex][vertexAIndex] = Infinity;
  }

  getNeighbors(from: Vertex): Array<Vertex> {
    if (!(from.name in this.vertexIndexTable)) return [];

    const neighbors: Array<Vertex> = [];

    const vertexIndex = this.vertexIndexTable[from.name];

    this.matrix[vertexIndex].forEach((weight, index) => {
      if (weight < Infinity) neighbors.push(this.vertices[index]);
    });

    return neighbors;
  }

  getEdgeWeight(from: Vertex, to: Vertex): number {
    if (
      !(from.name in this.vertexIndexTable) ||
      !(to.name in this.vertexIndexTable)
    )
      return Infinity;

    const fromIndex = this.vertexIndexTable[from.name];
    const toIndex = this.vertexIndexTable[to.name];

    return this.matrix[fromIndex][toIndex];
  }
}
