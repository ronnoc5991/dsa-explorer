import { VertexName } from "./Vertex";

class Edge {
  from: VertexName;
  to: VertexName;
  weight: number;

  constructor(from: VertexName, to: VertexName, weight: number) {
    this.from = from;
    this.to = to;
    this.weight = weight;
  }
}

export default Edge;
