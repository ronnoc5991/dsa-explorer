import Edge from "./Edge";
import { VertexName } from "./Vertex";

export type Edges = Array<Edge>;

export interface Graph {
  getVerticesNames(): Readonly<Array<VertexName>>;
  addEdge(u: VertexName, v: VertexName, weight: number): void;
  getNeighbors(u: VertexName): Array<VertexName>;
  getEdgeWeight(u: VertexName, v: VertexName): number;
}

export class AdjacencyList implements Graph {
  private table: Map<VertexName, Edges>;
  private vertices: Array<VertexName>;

  constructor(vertices: Array<VertexName>) {
    this.table = new Map();
    this.vertices = vertices;
  }

  getVerticesNames(): Readonly<Array<VertexName>> {
    return this.vertices as Readonly<Array<VertexName>>;
  }

  addEdge(u: VertexName, v: VertexName, weight: number) {
    if (!this.table.has(u)) this.table.set(u, new Array());
    if (!this.table.has(v)) this.table.set(v, new Array());
    this.table.get(u)?.push(new Edge(u, v, weight));
    this.table.get(v)?.push(new Edge(v, u, weight));
  }

  getNeighbors(u: VertexName): Array<VertexName> {
    return this.table.get(u)?.map((edge) => edge.to) ?? [];
  }

  getEdgeWeight(u: VertexName, v: VertexName): number {
    const edges = this.table.get(u);
    const edge = edges?.find((e) => e.to === v);
    return edge ? edge.weight : Infinity;
  }
}

export class AdjacencyMatrix implements Graph {
  private vertices: Array<VertexName>;
  private matrix: Array<Array<number>>;
  private vertexIndexTable: Map<VertexName, number> = new Map();

  constructor(vertices: Array<VertexName>) {
    this.vertices = vertices;

    this.matrix = Array.from({ length: this.vertices.length }).map(() =>
      new Array(this.vertices.length).fill(Infinity)
    );

    vertices.forEach((vertex, index) => {
      this.vertexIndexTable.set(vertex, index);
    });
  }

  getVerticesNames(): Array<VertexName> {
    return this.vertices;
  }

  addEdge(u: VertexName, v: VertexName, weight: number) {
    if (!this.vertexIndexTable.has(u) || !this.vertexIndexTable.has(v)) return;

    const uIndex = this.vertexIndexTable.get(u) as number;
    const vIndex = this.vertexIndexTable.get(v) as number;

    this.matrix[uIndex][vIndex] = weight;
    this.matrix[vIndex][uIndex] = weight;
  }

  getNeighbors(from: VertexName): Array<VertexName> {
    if (!this.vertexIndexTable.has(from)) return [];

    const neighbors: Array<VertexName> = [];

    const vertexIndex = this.vertexIndexTable.get(from) as number;

    this.matrix[vertexIndex].forEach((weight, index) => {
      if (weight < Infinity) neighbors.push(this.vertices[index]);
    });

    return neighbors;
  }

  getEdgeWeight(from: VertexName, to: VertexName): number {
    if (!this.vertexIndexTable.has(from) || !this.vertexIndexTable.has(from))
      return Infinity;

    const fromIndex = this.vertexIndexTable.get(from) as number;
    const toIndex = this.vertexIndexTable.get(to) as number;

    return this.matrix[fromIndex][toIndex];
  }
}
