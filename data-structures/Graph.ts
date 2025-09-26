export type Vertex = string;
export type Edge = string;
export type Edges = Array<Edge>;

// TODO: directed graph vs undirected graph... worth creating different classes?
export interface Graph {
  addEdge(vertexA: Vertex, vertexB: Vertex): void; // TODO: boolean to show success/failure
  removeEdge(vertexA: Vertex, vertexB: Vertex): void;
  getEdges(vertex: Vertex): Edges | null;
  hasEdge(from: Vertex, to: Vertex): boolean;
}

export class AdjacencyList implements Graph {
  table: Map<Vertex, Edges>;

  constructor(vertices: Array<Vertex>) {
    this.table = new Map();

    vertices.forEach((vertex) => this.table.set(vertex, new Array()));
  }

  addEdge(vertexA: Vertex, vertexB: Vertex) {
    if (!this.table.has(vertexA)) this.table.set(vertexA, new Array());
    if (!this.table.has(vertexB)) this.table.set(vertexB, new Array());
    this.table.get(vertexA)?.push(vertexB);
    this.table.get(vertexB)?.push(vertexA);
  }

  removeEdge(vertexA: Vertex, vertexB: Vertex) {
    if (this.table.has(vertexA))
      this.table.set(
        vertexA,
        this.table.get(vertexA)?.filter((vertex) => vertex !== vertexB) ??
          new Array()
      );
    if (this.table.has(vertexB))
      this.table.set(
        vertexB,
        this.table.get(vertexB)?.filter((vertex) => vertex !== vertexA) ??
          new Array()
      );
  }

  getEdges(vertex: Vertex) {
    if (this.table.has(vertex)) return this.table.get(vertex) as Edges;

    return null;
  }

  hasEdge(from: Vertex, to: Vertex) {
    if (!this.table.has(from)) return false;

    const edgesFromFrom = this.table.get(from);

    return edgesFromFrom?.find((v) => v === to) !== undefined;
  }
}

export class AdjacencyMatrix implements Graph {
  vertices: Array<Vertex>;
  matrix: Array<Array<boolean>>;
  vertexIndexTable: Record<Vertex, number> = {};

  constructor(vertices: Array<Vertex>) {
    this.vertices = vertices;

    const numberOfVertices = vertices.length;

    this.matrix = Array.from({ length: numberOfVertices }).map(() =>
      new Array(numberOfVertices).fill(false)
    );

    vertices.forEach((vertex, index) => {
      this.vertexIndexTable[vertex] = index;
    });
  }

  addEdge(vertexA: Vertex, vertexB: Vertex) {
    if (
      !(vertexA in this.vertexIndexTable) ||
      !(vertexB in this.vertexIndexTable)
    )
      return;

    const vertexAIndex = this.vertexIndexTable[vertexA];
    const vertexBIndex = this.vertexIndexTable[vertexB];

    this.matrix[vertexAIndex][vertexBIndex] = true;
    this.matrix[vertexBIndex][vertexAIndex] = true;
  }

  removeEdge(vertexA: Vertex, vertexB: Vertex) {
    if (
      !(vertexA in this.vertexIndexTable) ||
      !(vertexB in this.vertexIndexTable)
    )
      return;

    const vertexAIndex = this.vertexIndexTable[vertexA];
    const vertexBIndex = this.vertexIndexTable[vertexB];

    this.matrix[vertexAIndex][vertexBIndex] = false;
    this.matrix[vertexBIndex][vertexAIndex] = false;
  }

  getEdges(vertex: Vertex) {
    if (!(vertex in this.vertexIndexTable)) return null;

    const edges: Edges = [];

    const vertexIndex = this.vertexIndexTable[vertex];

    this.matrix[vertexIndex].forEach((edgeExists, index) => {
      if (edgeExists) edges.push(this.vertices[index]);
    });

    return edges;
  }

  hasEdge(from: Vertex, to: Vertex) {
    if (!(from in this.vertexIndexTable) || !(to in this.vertexIndexTable))
      return false;

    const fromIndex = this.vertexIndexTable[from];
    const toIndex = this.vertexIndexTable[to];

    return this.matrix[fromIndex][toIndex];
  }
}
