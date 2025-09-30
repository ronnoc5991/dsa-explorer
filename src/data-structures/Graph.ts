import Edge from "./Edge";

export type Edges = Array<Edge>;
type Vertex = [number, number];

export interface Graph {
  getVertices(): Array<Vertex>;
  addEdge(u: Vertex, v: Vertex, weight: number): void;
  getNeighbors(u: Vertex): Array<Vertex>;
  getEdgeWeight(u: Vertex, v: Vertex): number;
}

// TODO: should the edge be refactored? or is it useful as is?
// Edge could be a tuple with three elements?
// type Edge = [Vertex, Vertex, number];
// why would an edge be this?

export class AdjacencyList implements Graph {
  private table: Map<Vertex, Edges>;
  private vertices: Set<Vertex>;

  constructor(vertices: Array<Vertex>) {
    this.table = new Map();
    this.vertices = new Set();
    vertices.forEach((v) => this.vertices.add(v));
  }

  getVertices(): Array<Vertex> {
    return Array.from(this.vertices);
  }

  addEdge(u: Vertex, v: Vertex, weight: number) {
    if (!this.table.has(u)) this.table.set(u, new Array());
    if (!this.table.has(v)) this.table.set(v, new Array());
    this.table.get(u)?.push(new Edge(u, v, weight));
    this.table.get(v)?.push(new Edge(v, u, weight));
  }

  getNeighbors(u: Vertex): Array<Vertex> {
    return this.table.get(u)?.map((edge) => edge.to) ?? [];
  }

  getEdgeWeight(u: Vertex, v: Vertex): number {
    const edges = this.table.get(u);
    const edge = edges?.find((e) => e.to === v);
    return edge ? edge.weight : Infinity;
  }
}

export class AdjacencyMatrix implements Graph {
  private vertices: Array<Vertex>;
  private matrix: Array<Array<number>>;
  private vertexIndexTable: Map<Vertex, number> = new Map();

  constructor(vertices: Array<Vertex>) {
    this.vertices = vertices;

    this.matrix = Array.from({ length: this.vertices.length }).map(() =>
      new Array(this.vertices.length).fill(Infinity)
    );

    vertices.forEach((vertex, index) => {
      this.vertexIndexTable.set(vertex, index);
    });
  }

  getVertices(): Array<Vertex> {
    return this.vertices;
  }

  addEdge(u: Vertex, v: Vertex, weight: number) {
    if (!this.vertexIndexTable.has(u) || !this.vertexIndexTable.has(v)) return;

    const uIndex = this.vertexIndexTable.get(u) as number;
    const vIndex = this.vertexIndexTable.get(v) as number;

    this.matrix[uIndex][vIndex] = weight;
    this.matrix[vIndex][uIndex] = weight;
  }

  getNeighbors(from: Vertex): Array<Vertex> {
    if (!this.vertexIndexTable.has(from)) return [];

    const neighbors: Array<Vertex> = [];

    const vertexIndex = this.vertexIndexTable.get(from) as number;

    this.matrix[vertexIndex].forEach((weight, index) => {
      if (weight < Infinity) neighbors.push(this.vertices[index]);
    });

    return neighbors;
  }

  getEdgeWeight(from: Vertex, to: Vertex): number {
    if (!this.vertexIndexTable.has(from) || !this.vertexIndexTable.has(from))
      return Infinity;

    const fromIndex = this.vertexIndexTable.get(from) as number;
    const toIndex = this.vertexIndexTable.get(to) as number;

    return this.matrix[fromIndex][toIndex];
  }
}
